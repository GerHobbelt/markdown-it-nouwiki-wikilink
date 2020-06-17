
module.exports = function wikilink_plugin(md, opt) {
  let originalRule = md.renderer.rules.link_open;

  let head = '';
  let tail = '';
  let atHead = '';
  let atTail = '';
  if (opt) {
    head = opt.head || head;
    tail = opt.tail || tail;
    atHead = opt.atHead || atHead;
    atTail = opt.atTail || atTail;
  }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    let hrefIndex = tokens[idx].attrIndex('href');
    let href = tokens[idx].attrs[hrefIndex][1];

    if (hrefIndex >= 0 && href === '') { // if markdown link doesn't contain a url use the text as url (wikilink)
      let str = tokens[idx + 1].content.split('|');
      let title = str[0];

      // @links
      let actualHead = head;
      //var actualTail = tail;
      let wiki = '';
      if (title.indexOf('@') > -1) {
        let split = title.split('@');
        title = split[0];
        wiki = split[1];
        if (title === 'index' || title === '') {
          title = '';
          atTail = '/';
        }
        wiki = atHead + wiki + atTail;
        actualHead = wiki;
      } else if (title === 'index' || title === '') {
        title = '';
        head = '';
        actualHead = head;
      }

      tokens[idx].attrs[hrefIndex][1] = actualHead + encodeURI(title) + tail;
      if (str.length > 1) {
        str.splice(0, 1);
        tokens[idx + 1].content = str.join('|');
      }
    }

    if (originalRule) {
      return originalRule.apply(self, arguments);
    }

      // There was no previous renderer override. Just call the default.
    return self.renderToken.apply(self, arguments);

  };
};
