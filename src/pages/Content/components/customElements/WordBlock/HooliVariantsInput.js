import { CloseIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';

class HooliVariantsInput extends LitElement {
  static get properties() {
    return {
      tags: { type: Array },
      placeholder: { type: String },
      _inputValue: { state: true },
    };
  }
  constructor() {
    super();
    this.tags = [];
    this.placeholder = '';
    this._inputValue = '';
  }
  static styles = [
    css`
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
        display: inline;
      }
      input {
        border: none;
        outline: grey solid 1px;
        display: inline-block;
        background-color: white;
        color: black;
        width: 170px;
      }
      .warning {
        outline: red solid 1px;
      }
    `,
  ];

  get textInput() {
    return this.renderRoot.querySelector('input');
  }
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

  render() {
    return html`
        <div id='container' @click="${this._handleFocus}" @focusout="${
      this._addNewTag
    }">
    <input type='text'
    placeholder=${this.placeholder}
     @keydown="${this._handleKeyBoardEvent}"
     @input="${this._handleInput}"
     .value=${this._inputValue}
     ></input>
        ${this._tagsDisplay()}
        </div>
        `;
  }

  _addNewTag() {
    const newTag = this._inputValue?.trim();
    if (!newTag) return;
    this.tags = this.tags.concat([newTag]);
    this._inputValue = '';
  }

  _handleInput(e) {
    this._inputValue = e.target.value;
    this.textInput.classList.remove('warning');
  }

  _handleFocus() {
    this.textInput.focus();
  }
  _handleRemove(e) {
    const target = e
      .composedPath()
      .find((node) => node.className === 'tag-span');
    const targetTag = target.innerText.trim();
    if (targetTag) this.tags = this.tags.filter((tag) => tag !== targetTag);
  }
  _handleKeyBoardEvent(e) {
    if (e.isComposing) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      // const inputEle = this.renderRoot.querySelector('input');
      const newTag = this._inputValue.trim();
      if (this.tags.indexOf(newTag) !== -1 || !newTag) {
        this.textInput.classList.add('warning');
        return;
      }
      this._addNewTag();
    }
    if (e.key === 'Backspace') {
      // const inputEle = this.renderRoot.querySelector('input');
      if (this._inputValue || this.tags.length === 0) return;
      this.tags = this.tags.slice(0, this.tags.length - 1);
    }
  }
}
customElements.define('hooli-variants-input', HooliVariantsInput);
