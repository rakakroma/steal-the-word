import '../components/customElements/HooliText';
import '../components/customElements/HooliWordInfoBlock';
import { myList, newList } from '../index';
import { currentURL } from './currentURL';
import { getRegexByMatchRule } from './matchRule';
export let wordInPageList = [];

let theCurrentURL = currentURL();

export const transformElementId = (eleId, target) => {
  const splittedEleId = eleId.split('-');
  if (target === 'wordId')
    return splittedEleId.slice(1, splittedEleId.length - 1).join('-');
  if (target === 'count') return splittedEleId[splittedEleId.length - 1];
};

export const clearNoLongerExistWordInWordInPageList = () => {
  const wordIdOfHooliTextsOnDoc = [];
  document.querySelectorAll('hooli-text').forEach((ele) => {
    const wordId = transformElementId(ele.id, 'wordId');
    if (wordIdOfHooliTextsOnDoc.indexOf(wordId) < 0)
      wordIdOfHooliTextsOnDoc.push(wordId);
  });

  wordInPageList = wordInPageList.filter((wordObj) => {
    if (wordIdOfHooliTextsOnDoc.indexOf(wordObj.id) < 0) return false;
    return true;
  });
};

const putHooliTextOnNode = (targetNode) => {
  // for (let wordObj of myList) {
  //todo: support variants match, i think extend the list directly instead of check every 'variants' property might get better performance
  //todo: deal with first character capital word
  for (let textPair of newList) {
    // let matchText = wordObj.stem || wordObj.word;
    const { matchText } = textPair;
    if (targetNode.textContent.indexOf(matchText) > -1) {
      const wordObj = myList.find(
        (wordObj) => wordObj.id === textPair.wordIdRef
      );
      if (!wordObj) return;

      const langRegex = new RegExp(
        /\p{sc=Hani}|\p{sc=Hira}|\p{sc=Kana}|\p{sc=Hang}/,
        'um'
      ); //chinese(han), japanese(hiragana, katakana), korean(hangul)
      const boundaryRegex = new RegExp(
        getRegexByMatchRule(matchText, wordObj.matchRule || 'start'),
        'im'
      );

      // const boundaryRegex = new RegExp(`\\b${matchText}`, 'im')

      //languages do not  have word separator (which means can't use /b as word boundary):
      //Thai, Lao, Khmer, Chinese, Japanese, Korean
      //further reading: https://www.w3.org/International/articles/typography/linebreak

      //languages may need to deal with the capitalization(first letter as a capital letter) situation
      //Latin, Armenian, Cyrillic, Georgian, Greek alphabets.
      //unicode script: Latn, Grek, Cyrl,Geor

      if (
        !langRegex.test(matchText) &&
        !boundaryRegex.test(targetNode.textContent)
      )
        return;

      let replaceText = matchText;
      const sentenceWithoutWord = targetNode.textContent.split(replaceText);
      const countMatchedTime = sentenceWithoutWord.length - 1;

      const theWordInTheList = wordInPageList.find(
        (wordObjInDisplay) => wordObjInDisplay.id === wordObj.id
      );
      if (!theWordInTheList) {
        if (currentURL() !== theCurrentURL) {
          theCurrentURL = currentURL();
          clearNoLongerExistWordInWordInPageList();
        }
        wordInPageList.push({
          ...wordObj,
          countInCurrentPage: countMatchedTime,
          currentContext: targetNode.textContent,
        });
        chrome.runtime.sendMessage({
          action: 'updateWordCount',
          count: wordInPageList.length,
        });

        const wordListEle = document.querySelector('hooli-floating-word-list');
        wordListEle?.requestUpdate();
        const minimizedWordListEle = document.querySelector(
          'hooli-wordlist-minimized-bar'
        );
        if (minimizedWordListEle?.mode === 'autoOpen') {
          const newWordListEle = document.createElement(
            'hooli-floating-word-list'
          );
          document.body.appendChild(newWordListEle);
          minimizedWordListEle.remove();
        } else {
          minimizedWordListEle?.requestUpdate();
        }
      } else {
        wordInPageList.map((wordObjInList) => {
          if (wordObj.id === wordObjInList.id) {
            wordObjInList.countInCurrentPage += countMatchedTime;
            return wordObjInList;
          }

          return wordObjInList;
        });
      }
      const updatedWordInTheList = wordInPageList.find(
        (wordObjInDisplay) => wordObjInDisplay.id === wordObj.id
      );

      const createTheWordNode = (wordObj, count) => {
        const word = replaceText;
        const renderNode = document.createElement('hooli-text');
        renderNode.wordObj = wordObj;
        renderNode.textContent = word;
        renderNode.id = `h-${wordObj.id}-${
          updatedWordInTheList.countInCurrentPage - countMatchedTime + count + 1
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

      // const allHooliText = fragment.querySelectorAll('hooli-text')
      // allHooliText.forEach(hooliText => {
      //     observerForIntersection.observe(hooliText)
      // })

      const span = document.createElement('span');
      targetNode.replaceWith(span);
      span.replaceWith(fragment);
    }
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
    if (good_tags_list.indexOf(node.parentNode.tagName) !== -1) {
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
