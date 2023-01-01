import { html } from 'lit';

export const editableContext = (wordBlock, value) => {
  return html` <hooli-textarea
    id="context-textarea"
    placeholder="context/sentence"
    minlength="1"
    class="editable"
    value=${value}
    @keypress="${wordBlock._handleEnterSubmit}"
    @input="${wordBlock._handleValidInput}"
  ></hooli-textarea>`;
};
