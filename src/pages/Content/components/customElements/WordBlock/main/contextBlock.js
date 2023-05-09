import { html } from 'lit';
import { currentURL } from '../../../../utils/currentURL';
import '../../HolliToolTip';
import { contextForLookUp } from './contextForLookUp';
import { definitionInputAndSelector } from './definitionInputAndSelector';
import { editableContext } from './editableContext';
import { highlightingBlock } from './highlightingBlock';
import { matchRuleSelection } from './matchRuleSelection';
import { pageTitle } from './pageTitle';
import { getPageTitle } from '../form/getPageTitle';

export const contextSection = (wordBlock) => {
  //---------definition and note: type: display / input / radio(choose one)-------------------

  if (wordBlock.mode === 'newWord') {
    return html`
      ${wordBlock._formInputStatus.openMatchRule
        ? matchRuleSelection(
            wordBlock.wordObj?.word || wordBlock.newWord,
            wordBlock.wordObj?.stem,
            wordBlock.wordObj?.variants,
            wordBlock.wordObj?.matchRule
          )
        : null}
      ${definitionInputAndSelector(wordBlock)}
      ${editableContext(wordBlock, wordBlock.contextHere)}
      ${pageTitle(
        wordBlock,
        wordBlock._currentSiteIcoSrc,
        currentURL(),
        getPageTitle()
      )}
    `;
  }
  if (wordBlock.mode === 'newContext') {
    return html`${definitionInputAndSelector(wordBlock)}
    ${editableContext(wordBlock, wordBlock.contextHere)}
    ${pageTitle(
      wordBlock,
      wordBlock._currentSiteIcoSrc,
      currentURL(),
      getPageTitle()
    )} `;
  }
  if (wordBlock.mode === 'editWord') {
    if (
      wordBlock.wordObj.stem ||
      wordBlock.wordObj.variants?.length > 0 ||
      wordBlock.wordObj.matchRule
    ) {
      wordBlock._handleUpdateFormStatus('openMatchRule', true);
    }

    return html`
      ${wordBlock._formInputStatus.openMatchRule
        ? matchRuleSelection(
            wordBlock.wordObj?.word,
            wordBlock.wordObj?.stem,
            wordBlock.wordObj?.variants,
            wordBlock.wordObj?.matchRule
          )
        : null}
      ${definitionInputAndSelector(wordBlock)}
    `;
  }
  if (
    wordBlock.mode === 'editContext' &&
    wordBlock._formInputStatus.workingContext
  ) {
    const contextObj = wordBlock.contexts.find(
      (contextObj) =>
        contextObj.id === wordBlock._formInputStatus.workingContext
    );

    return html`
      ${definitionInputAndSelector(wordBlock)}
      ${editableContext(wordBlock, contextObj.context)}
    `;
  }
  if (
    wordBlock.mode === 'highlighting' &&
    wordBlock._formInputStatus.workingContext
  ) {
    return html`${highlightingBlock(wordBlock)}`;
  }

  if (
    (wordBlock.mode === 'lookUp' && wordBlock.contexts) ||
    wordBlock.mode === 'deleting'
  ) {
    return html`${contextForLookUp(wordBlock)}`;
  }
};
