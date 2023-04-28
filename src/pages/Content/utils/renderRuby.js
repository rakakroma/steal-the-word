import '../components/customElements/HooliText';
import '../components/customElements/HooliWordInfoBlock';
import { store } from '../redux/store';
import { getMatchRefList, getWordList } from '../redux/wordDataSlice';
import { myLog } from './customLogger';
import { putHooliTextOnNode } from './putHooliTextOnNode';

export const isAscendantContentEditable = (element) => {
  while (element) {
    if (element.contentEditable === 'true') {
      return true;
    }
    element = element.parentElement;
  }
  return false;
};

export const renderMultipleRuby = (nodesArray) => {
  const performanceStart = performance.now();

  nodesArray.forEach((node) => {
    renderRuby(node);
  });

  const performanceEnd = performance.now();
  myLog(`RenderRuby time ${(performanceEnd - performanceStart).toFixed(2)} ms`);
};

export const renderRuby = (target) => {
  const startTime = performance.now();

  const nodeIterator = document.createNodeIterator(
    target,
    NodeFilter.SHOW_TEXT,
    myGoodFilter
  );
  // mygoodfilter source:
  // https://github.com/XQDD/highlight_new_words/blob/12be7a1d79ad209ffffcbfc1038efbb7aa3bbd8c/content_scripts/highlight.js#L329
  function myGoodFilter(node) {
    const good_tags_list = [
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
    if (
      node.parentNode &&
      good_tags_list.indexOf(node.parentNode.tagName) > -1
    ) {
      return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_SKIP;
  }

  const myList = getWordList(store.getState());
  const newList = getMatchRefList(store.getState());

  let textNode;
  while ((textNode = nodeIterator.nextNode())) {
    const currentTime = performance.now();

    const time = currentTime - startTime;
    if (time > 3000) {
      myLog('stop execute renderRuby');
      break;
    }

    putHooliTextOnNode(textNode, myList, newList);
  }
};
