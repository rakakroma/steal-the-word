import { html } from 'lit';
import { contextDate } from './contextDate';

export const highlightingBlock = (wordBlock) => {
  const contextObj = wordBlock.contexts.find(
    (contextObj) => contextObj.id === wordBlock._formInputStatus.workingContext
  );
  const selectedText = wordBlock._formInputStatus.phraseSelection;

  return html` <div class="definition-and-contexts-container">
    <div class="outer-context-container">
      <div class="vertical-line"></div>
      <div class="inner-context-container">
        <h5 class="phrase">${selectedText}</h5>
        <p id="p-${contextObj.id}" class="highlighting">
          <hooli-highlighter
            text=${contextObj.context}
            matchword=${selectedText}
          >
          </hooli-highlighter>
          ${contextDate(contextObj.date)}
        </p>
      </div>
    </div>
  </div>`;
};
