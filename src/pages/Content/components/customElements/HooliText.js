import '@webcomponents/custom-elements';
import { CloseIcon, BoxAddIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { getSentenceFromSelection } from '../../utils/get-selection-more.ts';
import './HooliWordInfoBlock.js';
import { setWordBlockPosition } from '../../utils/setWordBlockPosition';
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  inline,
} from '@floating-ui/dom';

export const openAddNewWord = () => {
  if (!document.getSelection().toString().trim()) return;
  const existingWordBlock = document.querySelector('hooli-wordinfo-block');
  existingWordBlock?.remove();
  const wordBlock = document.createElement('hooli-wordinfo-block');
  wordBlock.mode = 'newWord';
  wordBlock.newWord = document.getSelection().toString().trim();
  wordBlock.contextHere = getSentenceFromSelection(document.getSelection());

  setWordBlockPosition(window.getSelection().getRangeAt(0), wordBlock);
  document.getSelection()?.removeAllRanges();
  document.body.appendChild(wordBlock);
};

class HooliText extends LitElement {
  static get properties() {
    return {
      ruby: { type: Boolean },
      wordObj: { type: Object },
    };
  }

  constructor() {
    super();
    this.ruby = false;
    this.wordObj = null;
  }

  static styles = [
    css`
      :host {
        cursor: pointer;
        color: white;
        background-color: slategray;
      }
      #annotation-tip {
        left: 0;
        top: 0;
        position: absolute;
        display: inline-block;
        z-index: 9999999;
        padding: 3px; /* 余白 */
        white-space: nowrap; /* テキストを折り返さない */
        font-size: 12px; /* フォントサイズ */
        line-height: 1.3; /* 行間 */
        background: rgb(241, 241, 241); /* 背景色 */
        color: rgb(0, 0, 0); /* 文字色 */
        border-radius: 3px; /* 角丸 */
        transition: 0.1s ease-in; /* アニメーション */
        opacity: 0;
        visibility: hidden;
        font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        font-style: normal;
      }

      #annotation-tip.show-tooltip {
        opacity: 1;
        visibility: visible;
      }
    `,
  ];

  renderElement() {
    const annotation = this.wordObj.definitions[0].aliases[0];
    return html`<span @click="${this.openWordBlock}" id="hooli-text-container"
      ><slot></slot
      ><span><div id="annotation-tip">${annotation}</div></span></span
    >`;
  }

  render() {
    return html`${this.renderElement()}`;
  }
  getContextSentenceFromThisEle() {
    const range = document.createRange();
    range.selectNode(this);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    const context = getSentenceFromSelection(document.getSelection());
    window.getSelection().removeAllRanges();
    return context;
  }
  openWordBlock() {
    document.querySelector('hooli-wordinfo-block')?.remove();
    const wordBlock = document.createElement('hooli-wordinfo-block');
    wordBlock.wordObj = this.wordObj;
    wordBlock.contextHere = this.getContextSentenceFromThisEle();
    setWordBlockPosition(this, wordBlock);
    document.body.appendChild(wordBlock);

    const floatingWordList = document.querySelector('hooli-floating-word-list');
    if (floatingWordList) {
      const idSplitByDash = this.id.split('-');
      const currentFocusCount = +idSplitByDash[idSplitByDash.length - 1];
      floatingWordList.gotLookingWord(this.wordObj.id, currentFocusCount);
    }
  }

  firstUpdated() {
    const tooltip = this.renderRoot.querySelector('#annotation-tip');
    const container = this.renderRoot.querySelector('#hooli-text-container');

    const update = () => {
      computePosition(container, tooltip, {
        placement: 'top',
        middleware: [offset(3), inline(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };

    const showTooltip = () => {
      update();
      if (!tooltip.classList.contains('show-tooltip'))
        tooltip.classList.add('show-tooltip');
    };

    const hideTooltip = () => {
      if (tooltip.classList.contains('show-tooltip')) {
        tooltip.classList.remove('show-tooltip');
      }
    };
    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      // ['focusin', showTooltip],
      // ['focusout', hideTooltip],
      // ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      container.addEventListener(event, listener);
    });
    update();
  }
}

customElements.define('hooli-text', HooliText);

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

class HooliAddingTool extends LitElement {
  static styles = [
    css`
      :host {
        z-index: 99999999;
        position: absolute;
      }
      button {
        background: white;
        color: #19d819;
        border-radius: 8px;
        border: none;
      }
    `,
  ];

  render() {
    return html`<button @click="${this._handleAddText}">
      ${BoxAddIcon({ width: 18, height: 18 })}
    </button>`;
  }

  get _thisElementOnBody() {
    return document.querySelector('hooli-adding-tool');
  }
  _handleAddText(e) {
    // e.preventDefault()
    // e.stopPropagation()
    openAddNewWord();
    setTimeout(() => document.querySelector('hooli-adding-tool')?.remove());
  }
}
customElements.define('hooli-adding-tool', HooliAddingTool);

class HooliTagsInput extends LitElement {
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

  render() {
    return html`
        <div id='container' @click="${this._handleFocus}">
        <input type='text'
        placeholder=${this.placeholder}
         @keypress="${this._handleKeyBoardEvent}"></input>
        ${this._tagsDisplay()}
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
  }
  _handleKeyBoardEvent(e) {
    // if(this.tags.length > 0 && e.key === 'Backspace' && e.target.value === ''){
    //     this.tags = this.tags.slice(0,-1)
    // }
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputEle = this.renderRoot.querySelector('input');
      const newVariant = inputEle.value.trim();
      if (this.tags.indexOf(newVariant) !== -1 || !newVariant) {
        console.log('warning, this variant is already in list');
        return;
      }
      this.tags = this.tags.concat([newVariant]);
      inputEle.value = '';
    }
  }
}

customElements.define('hooli-tags-input', HooliTagsInput);
