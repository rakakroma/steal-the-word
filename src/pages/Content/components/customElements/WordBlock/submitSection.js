import { html } from 'lit';
import { translate } from 'lit-translate';

export const submitSection = (wordBlock) => {
  if (wordBlock.mode === 'lookUp') return null;
  return html`
    <div id="submit-helper-text">${wordBlock._formInputStatus.helperText}</div>
    <button
      type="button"
      @click="${wordBlock._handleCancel}"
      id="cancel-button"
      class="text-button"
    >
      ${translate('button.cancel')}
    </button>
    <button
      type="submit"
      ?disabled=${wordBlock._formInputStatus.submitting}
      @click="${wordBlock._handleFormSubmit}"
      id="submit-button"
      class="text-button"
    >
      ${translate(`button.${wordBlock.mode}`)}⏎
    </button>
  `;
};
