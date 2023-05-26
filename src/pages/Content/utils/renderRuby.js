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
    const CHUNK_SIZE = 20;
    let textNode = nodeIterator.nextNode();
    while (textNode && count < CHUNK_SIZE) {
      count++;
      const newHooliTextCount = putHooliTextOnNode(textNode, myList, newList);

      //FIXME: This is for performance but it is causing missing nodes so i comment it out
      // if (newHooliTextCount > 0 || textNode.textContent.length > 300) {
      //   break;
      // }

      textNode = nodeIterator.nextNode();
    }
    if (!textNode) return;

    requestAnimationFrame(processChunk);
    //should cost less than 16ms
    // myLog('cost time, each animation frame', performance.now() - startTime);
  };
  processChunk();
};
