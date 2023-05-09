// https://github.com/XQDD/highlight_new_words/blob/12be7a1d79ad209ffffcbfc1038efbb7aa3bbd8c/content_scripts/highlight.js#L329

export const good_tags_list = [
  'PRE',
  'A',
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'B',
  'SMALL',
  'STRONG',
  'Q',
  'DIV',
  'SPAN',
  'LI',
  'TD',
  'OPTION',
  'I',
  'BUTTON',
  'UL',
  'CODE',
  'EM',
  'TH',
  'CITE',
];

const tagForYoutube = ['YT-FORMATTED-STRING'];

export const myGoodFilter = (node) => {
  if (node.parentNode && good_tags_list.indexOf(node.parentNode.tagName) > -1) {
    return NodeFilter.FILTER_ACCEPT;
  }
  return NodeFilter.FILTER_SKIP;
};
