import '../components/customElements/HooliText';
import '../components/customElements/HooliWordInfoBlock';
import { store } from '../redux/store';
import { getMatchRefList, getWordList } from '../redux/wordDataSlice';
import { myLog } from './customLogger';
import { putHooliTextOnNode } from './putHooliTextOnNode';
import { myGoodFilter } from './myGoodFilter';

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
  nodesArray.forEach((node) => {
    renderRuby(node);
  });
};

export const renderRuby = (target) => {
  const nodeIterator = document.createNodeIterator(
    target,
    NodeFilter.SHOW_TEXT,
    myGoodFilter
  );

  const myList = getWordList(store.getState());
  const newList = getMatchRefList(store.getState());

  const processChunk = () => {
    const startTime = performance.now();
    let count = 0;
    const CHUNK_SIZE = 100;
    let textNode = nodeIterator.nextNode();
    while (textNode && count < CHUNK_SIZE) {
      count++;
      putHooliTextOnNode(textNode, myList, newList);
      textNode = nodeIterator.nextNode();
    }
    if (!textNode) {
      return;
    }

    requestAnimationFrame(processChunk);

    myLog('cost time, each animation frame', performance.now() - startTime);
  };
  processChunk();
};
