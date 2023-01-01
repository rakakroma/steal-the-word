import { html } from 'lit';
import { pageTitle } from './pageTitle';
import { contextDate } from './contextDate';
import { definitionTags } from './definitionTags';
import { LabelsIcon } from '@spectrum-web-components/icons-workflow';

const contextsOfDef = (contexts, definition) => {
  return contexts.filter(
    (contextObj) => contextObj.definitionRef === definition.definitionId
  );
};

const contextDisplay = (
  wordBlock,
  contextObj,
  matchedWord,
  mode,
  src,
  contexts
) => {
  return html`
    <div class="outer-context-container">
      <div class="vertical-line"></div>
      <div class="inner-context-container">
        ${mode === 'deleting' && contexts.length > 1
          ? html`<input type='checkbox' class='checkbox context-delete-checkbox' name=${contextObj.id} id='c-${contextObj.id}' @change="${wordBlock.handleCheckboxSelect}"></input>`
          : null}
        <h5 class="phrase">${contextObj.phrase}</h5>
        <p id="p-${contextObj.id}">
          <hooli-highlighter
            text=${contextObj.context}
            matchword=${matchedWord}
          >
          </hooli-highlighter>
          ${contextDate(contextObj.date)}
        </p>
      </div>
      ${pageTitle(
        wordBlock,
        src,
        contextObj.url,
        contextObj.pageTitle,
        contextObj.id
      )}
    </div>
  `;
};

export const openTagsInputButton = (wordBlock, definitionId) => {
  if (wordBlock.mode === 'deleting') return null;
  if (wordBlock._formInputStatus.editingTagDefId === definitionId) return null;

  const openTagsInput = (e) => {
    e.preventDefault();
    wordBlock._handleUpdateFormStatus('editingTagDefId', definitionId);
  };

  return html` <button class="icon-button" @click=${openTagsInput}>
    ${LabelsIcon({ width: 15, height: '15' })}
  </button>`;
};

export const contextForLookUp = (wordBlock) => {
  return html` ${wordBlock.wordObj.definitions.map((definition, i) => {
    return html` <div class="definition-and-contexts-container">
      <h6 class="annotation">
        ${definition.annotation}${definition.tags.length > 0
          ? null
          : openTagsInputButton(wordBlock, definition.definitionId)}
      </h6>
      <p class="definition-note">${definition.note}</p>
      ${wordBlock.mode === 'deleting'
        ? null
        : definitionTags(wordBlock, definition.tags, definition.definitionId)}
      ${contextsOfDef(wordBlock.contexts, definition).map(
        (contextObj, index) => {
          let matchedWord;
          matchedWord =
            contextObj.phrase ||
            wordBlock._matchWordsArray().find((string) => {
              const regex = new RegExp(string, 'gi');
              return regex.test(contextObj.context);
            });

          let src;
          if (wordBlock.imgSrcs.length > 0) {
            src = wordBlock.imgSrcs.find((domainObj) => {
              return domainObj.url === new URL(contextObj.url).hostname;
            })?.icon;
          }
          return html`${contextDisplay(
            wordBlock,
            contextObj,
            matchedWord,
            wordBlock.mode,
            src,
            wordBlock.contexts
          )}`;
        }
      )}
    </div>`;
  })}`;
};
