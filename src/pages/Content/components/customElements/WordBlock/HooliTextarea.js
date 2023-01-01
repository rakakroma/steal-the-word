import { LitElement, html, css } from 'lit';

class HooliTextarea extends LitElement {
  static get properties() {
    return {
      value: { type: String },
      placeholder: { type: String },
      maxLength: { type: Number },
      minLength: { type: Number },
      currentLength: { type: Number },
      // highlightText: { type: String }
    };
  }

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.maxLength = 460;
    this.minLength = null;
    this.currentLength = 0;
    // this.highlightedText = ''
  }

  static styles = [
    css`
      div {
        position: relative;
      }
      textarea {
        position: relative;
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
      }
      textarea:focus {
        outline: none;
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
        bottom: -4px;
        right: 10px;
      }
    `,
  ];

  render() {
    return html`
      <textarea
        @input="${this._handleAutoHeightAndUpdateValue}"
        placeholder="${this.placeholder}"
        maxlength="${this.maxLength}"
        .value=${this.value}
      ></textarea>
      <span id="count-length">${this.currentLength}/${this.maxLength}</span>
    `;
  }

  _handleAutoHeightAndUpdateValue(e) {
    this._handleUpdateValue(e);
    this._handleAutoHeight();
    this._handleCountCharacter(e.target.value);
  }

  _handleCountCharacter(value) {
    this.currentLength = value.length;
    const countLengthSpan = this.renderRoot.querySelector('#count-length');

    if (typeof this.minLength === 'number') {
      if (this.currentLength < this.minLength) {
        countLengthSpan.className = 'invalid-length';
        return;
      }
    }
    if (this.currentLength > this.maxLength) {
      countLengthSpan.className = 'invalid-length';
    } else if (this.currentLength === this.maxLength) {
      countLengthSpan.className = 'max-length';
    } else if (countLengthSpan.className) {
      countLengthSpan.className = '';
    }
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

  // firstUpdated(){
  // }
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
