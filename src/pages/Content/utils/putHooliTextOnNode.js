import { isLangsNotUseSpaceRegex } from '../../../utilsForAll/regexCheckLang';
import { addOrUpdatePageWordAndGetCount } from '../redux/displayingWordListSlice';
import { getRegexByMatchRule } from './matchRule';
import { isAscendantContentEditable } from './renderRuby';

export const putHooliTextOnNode = (targetNode, myList, matchList) => {
  //todo: deal with first character capital word
  for (let textPair of matchList) {
    const { matchText, wordMatchRule } = textPair;
    if (targetNode.textContent.indexOf(matchText) === -1) continue;

    const boundaryRegex = new RegExp(
      getRegexByMatchRule(matchText, wordMatchRule),
      'im'
    );
    //languages do not have word separator (which means can't use /b as word boundary):
    //Thai, Lao, Khmer, Chinese, Japanese, Korean
    //further reading: https://www.w3.org/International/articles/typography/linebreak
    //languages may need to deal with the capitalization(first letter as a capital letter) situation
    //Latin, Armenian, Cyrillic, Georgian, Greek alphabets.
    //unicode script: Latn, Grek, Cyrl,Geor
    if (
      !isLangsNotUseSpaceRegex.test(matchText) &&
      !boundaryRegex.test(targetNode.textContent)
    )
      continue;
    if (isAscendantContentEditable(targetNode)) continue;

    const wordObj = myList.find((wordObj) => wordObj.id === textPair.wordIdRef);
    if (!wordObj) continue;

    const sentenceWithoutWord = targetNode.textContent.split(matchText);
    const countMatchedTime = sentenceWithoutWord.length - 1;

    const currentCount = addOrUpdatePageWordAndGetCount({
      id: wordObj.id,
      countInCurrentPage: countMatchedTime,
    });

    const createTheWordNode = (wordObj, count) => {
      const renderNode = document.createElement('hooli-text');
      renderNode.textContent = matchText;
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
  }
};
