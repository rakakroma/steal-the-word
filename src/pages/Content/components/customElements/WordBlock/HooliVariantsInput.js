import { CloseIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';

class HooliVariantsInput extends LitElement {
  static get properties() {
    return {
      tags: { type: Array },
      placeholder: { type: String },
    };
  }
  constructor() {
    super();
    this.tags = [];
    this.placeholder = '';
  }
  static styles = [
    css`
      #container {
      }
      .tag-span {
        margin: 2px;
        border-radius: 4px;
        padding: 2px 3px;
        background-color: #e7e3de;
        cursor: pointer;
      }
      .remove-button {
        display: none;
      }
      .tag-span:hover > .remove-button,
      .remove-button:hover {
        display: inline-block;
      }
      input {
        color: black;
        border: none;
        display: inline-block;
        background-color: white;
      }
    `,
  ];

  _tagsDisplay() {
    return html`${this.tags?.map((tagText) => {
      return html`<span class="tag-span" @click="${this._handleRemove}"
        >${tagText}
        <span class="remove-button"
          >${CloseIcon({ width: 10, height: 10 })}</span
        >
      </span>`;
    })}`;
  }
  _customEventOptions() {
    return {
      detail: { tags: this.tags },
      bubbles: true,
      composed: true,
    };
  }

  render() {
    return html`
        <div id='container' @click="${this._handleFocus}">
        ${this._tagsDisplay()}
        <input type='text'
        placeholder=${this.placeholder}
         @keypress="${this._handleKeyBoardEvent}"></input>
        </div>
        `;
  }
  _handleFocus() {
    this.renderRoot.querySelector('input').focus();
  }
  _handleRemove(e) {
    const target = e
      .composedPath()
      .find((node) => node.className === 'tag-span');
    const targetTag = target.innerText.trim();
    if (targetTag) this.tags = this.tags.filter((tag) => tag !== targetTag);

    this.dispatchEvent(
      new CustomEvent('tagschange', this._customEventOptions())
    );
  }
  _handleKeyBoardEvent(e) {
    if (
      [
        'Enter',
        //  'Tab'
        //FIXME: tab is not work but I don't know why
      ].includes(e.key)
    ) {
      e.preventDefault();
      const inputEle = this.renderRoot.querySelector('input');
      const newTag = inputEle.value.trim();
      if (this.tags.indexOf(newTag) !== -1 || !newTag) {
        console.log('warning, this variant is already in list');
        return;
      }

      this.tags = this.tags.concat([newTag]);

      this.dispatchEvent(
        new CustomEvent('tagschange', this._customEventOptions())
      );

      inputEle.value = '';
    }
  }
}
customElements.define('hooli-variants-input', HooliVariantsInput);
