import { isCJKRegex } from '../../../utilsForAll/regexCheckLang';
import '../components/customElements/HooliText';
import '../components/customElements/HooliWordInfoBlock';
import { addOrUpdatePageWordAndGetCount } from '../redux/displayingWordListSlice';
import { store } from '../redux/store';
import { getMatchRefList, getWordList } from '../redux/wordDataSlice';
import { getRegexByMatchRule } from './matchRule';

// export let wordInPageList = [];

export const transformElementId = (eleId, target) => {
  const splittedEleId = eleId.split('-');
  if (target === 'wordId')
    return splittedEleId.slice(1, splittedEleId.length - 1).join('-');
  if (target === 'count') return splittedEleId[splittedEleId.length - 1];
};

const putHooliTextOnNode = (targetNode) => {
  const myList = getWordList(store.getState());
  const newList = getMatchRefList(store.getState());
  //todo: support variants match, i think extend the list directly instead of check every 'variants' property might get better performance
  //todo: deal with first character capital word
  for (let textPair of newList) {
    const { matchText, wordMatchRule } = textPair;
    if (targetNode.textContent.indexOf(matchText) === -1) continue;

    const boundaryRegex = new RegExp(
      getRegexByMatchRule(matchText, wordMatchRule),
      'im'
    );

    //languages do not  have word separator (which means can't use /b as word boundary):
    //Thai, Lao, Khmer, Chinese, Japanese, Korean
    //further reading: https://www.w3.org/International/articles/typography/linebreak

    //languages may need to deal with the capitalization(first letter as a capital letter) situation
    //Latin, Armenian, Cyrillic, Georgian, Greek alphabets.
    //unicode script: Latn, Grek, Cyrl,Geor

    if (
      !isCJKRegex.test(matchText) &&
      !boundaryRegex.test(targetNode.textContent)
    )
      continue;
    const wordObj = myList.find((wordObj) => wordObj.id === textPair.wordIdRef);
    if (!wordObj) continue;

    const sentenceWithoutWord = targetNode.textContent.split(matchText);
    const countMatchedTime = sentenceWithoutWord.length - 1;

    const currentCount = addOrUpdatePageWordAndGetCount({
      // ...wordObj,
      id: wordObj.id,
      countInCurrentPage: countMatchedTime,
    });

    const createTheWordNode = (wordObj, count) => {
      const word = matchText;
      const renderNode = document.createElement('hooli-text');
      renderNode.textContent = word;
      renderNode.id = `h-${wordObj.id}-${
        currentCount - countMatchedTime + count + 1
      }`;
      renderNode.className = `h-${wordObj.id}`;
      //id start from 1 not 0
      return renderNode;
    };

    const fragment = new DocumentFragment();

    sentenceWithoutWord.forEach((sentence, i) => {
      if (i === sentenceWithoutWord.length - 1) {
        fragment.append(sentence);
      } else {
        fragment.append(sentence, createTheWordNode(wordObj, i));
      }
    });

    const span = document.createElement('span');
    targetNode.replaceWith(span);
    span.replaceWith(fragment);
    // console.log(`create! ${matchText}`);
  }
};

export const renderMultipleRuby = (nodesArray) => {
  console.log('renderRuby execute');
  const performanceStart = performance.now();

  nodesArray.forEach((node) => {
    renderRuby(node, false);
  });

  const performanceEnd = performance.now();
  console.log(
    `RenderRuby time ${(performanceEnd - performanceStart).toFixed(2)} ms`
  );
};

export const renderRuby = (target, isStart) => {
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

  let textNode;
  while ((textNode = nodeIterator.nextNode())) {
    const currentTime = performance.now();

    const time = currentTime - startTime;
    if (time > 3000) {
      console.log('stop execute renderRuby');
      break;
    }

    putHooliTextOnNode(textNode);
  }
};
