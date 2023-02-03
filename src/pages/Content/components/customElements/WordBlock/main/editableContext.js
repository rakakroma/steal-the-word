import { html } from 'lit';
import { translate } from 'lit-translate';

export const editableContext = (wordBlock, value) => {
  return html` <hooli-textarea
    id="context-textarea"
    placeholder="${translate('placeholder.context')}"
    minlength="1"
    class="editable"
    value=${value}
    @keypress="${wordBlock._handleEnterSubmit}"
    @input="${wordBlock._handleValidInput}"
  ></hooli-textarea>`;
};
