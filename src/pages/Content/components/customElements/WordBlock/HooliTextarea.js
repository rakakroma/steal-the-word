import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

class HooliTextarea extends LitElement {
  static get properties() {
    return {
      value: { type: String },
      placeholder: { type: String },
      maxLength: { type: Number },
      minLength: { type: Number },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.maxLength = 460;
    this.minLength = null;
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('value')) {
      this._handleAutoHeight();
    }
  }

  static styles = [
    css`
      div {
        position: relative;
        color: inherit;
        background-color: inherit;
        font-family: inherit;
      }
      textarea {
        font-family: inherit;
        font-size: 13px;
        resize: none;
        overflow: hidden;
        padding-left: 5px;
        width: -webkit-fill-available;
        width: -moz-fill-available;
        width: -moz-available;
        width: fill-available;
        color: inherit;
        background-color: inherit;
        border: none;
        padding-bottom: 4px;
      }

      textarea:focus,
      textarea:focus-within,
      textarea:hover {
        outline: 1.5px solid #cecdcd;
      }

      #count-length.invalid-length {
        color: #ff7676;
      }
      #count-length.max-length {
        color: #e89961;
      }
      #count-length {
        color: rgb(208 204 204);
        position: absolute;
        bottom: 0px;
        right: 10px;
      }
    `,
  ];

  render() {
    const lengthCountClass = {
      'invalid-length':
        this.value.length < this.minLength ||
        this.value.length > this.maxLength,
      'max-length': this.value.length === this.maxLength,
    };
    return html`
      <div>
        <textarea
          @input="${this._handleAutoHeightAndUpdateValue}"
          .placeholder="${this.placeholder}"
          .maxLength="${this.maxLength}"
          .value=${this.value}
        ></textarea>
        <span id="count-length" class=${classMap(lengthCountClass)}
          >${this.value.length}/${this.maxLength}</span
        >
      </div>
    `;
  }

  _handleAutoHeightAndUpdateValue(e) {
    this._handleUpdateValue(e);
    this._handleAutoHeight();
  }

  _handleUpdateValue(e) {
    this.value = e.target.value;
  }
  _handleAutoHeight() {
    const theTextArea = this.renderRoot.querySelector('textarea');
    if (theTextArea.value.length < 20) {
      theTextArea.style.height = '15px';
      return;
    }
    theTextArea.style.height = 'auto';
    theTextArea.style.height = theTextArea.scrollHeight + 'px';
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this._handleAutoHeight(), 0);
    if (this.value.length > this.maxLength) {
      this.value = this.value.slice(0, this.maxLength);
    }
    this.currentLength = this.value.length;
  }
}
customElements.define('hooli-textarea', HooliTextarea);
