import { html } from 'lit';

export const submitSection = (wordBlock) => {
  const submitButtonTexts = {
    newContext: 'Add new context',
    editWord: 'Edit',
    editContext: 'Edit',
    newWord: 'Save ',
    deleting: 'Delete',
    highlighting: 'Highlight',
  };
  const getSubmitButtonText = () => {
    return submitButtonTexts[wordBlock.mode] + '⏎';
  };

  if (Object.keys(submitButtonTexts).includes(wordBlock.mode))
    return html`
      <div id="submit-helper-text">
        ${wordBlock._formInputStatus.helperText}
      </div>
      <button
        type="button"
        @click="${wordBlock._handleCancel}"
        id="cancel-button"
        class="text-button"
      >
        Cancel
      </button>
      <button
        type="submit"
        ?disabled=${wordBlock._formInputStatus.submitting}
        @click="${wordBlock._handleFormSubmit}"
        id="submit-button"
        class="text-button"
      >
        ${getSubmitButtonText()}
      </button>
    `;
};
