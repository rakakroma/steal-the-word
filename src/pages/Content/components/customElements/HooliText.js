import '@webcomponents/custom-elements';
import { LitElement, html, css } from 'lit';
import { getSentenceFromSelection } from '../../utils/get-selection-more.ts';
import './HooliWordInfoBlock.js';
import { setWordBlockPosition } from '../../utils/setPosition';
import { computePosition, shift, offset, inline } from '@floating-ui/dom';
import { connect } from 'pwa-helpers';
import { store } from '../../redux/store';
import { getWordById } from '../../redux/wordDataSlice';

const removeWordBlock = () =>
  document.querySelector('hooli-wordinfo-block')?.remove();

export const openAddNewWord = () => {
  if (!document.getSelection().toString().trim()) return;
  removeWordBlock();
  const wordBlock = document.createElement('hooli-wordinfo-block');
  wordBlock.mode = 'newWord';
  wordBlock.newWord = document.getSelection().toString().trim();
  wordBlock.contextHere = getSentenceFromSelection(document.getSelection());

  setWordBlockPosition(window.getSelection().getRangeAt(0), wordBlock);
  document.getSelection()?.removeAllRanges();
  document.body.appendChild(wordBlock);
};

class HooliText extends connect(store)(LitElement) {
  static get properties() {
    return {
      wordObj: { type: Object },
    };
  }
  stateChanged(state) {
    this.wordObj = getWordById(state, this.className.slice(2));
  }
  static styles = [
    css`
      :host {
        all: initial;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        cursor: pointer;
        color: white;
        background-color: slategray;
        white-space: normal;
        display: inline-block;
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
      .divider {
        border: 0;
        display: block;
        width: 98%;
        background-color: #c0c0c0;
        height: 1px;
        margin: 0;
      }
    `,
  ];

  renderElement() {
    if (!this.wordObj) {
      return html`<slot></slot>`;
    }
    const definitionLength = this.wordObj.definitions.length;
    return html`<slot></slot>
      <div id="annotation-tip">
        ${this.wordObj.definitions.map((definition, i) => {
          if (i < definitionLength - 1) {
            return html`<div>${definition.annotation}</div>
              <div class="divider"></div>`;
          } else {
            return html`<div>${definition.annotation}</div>`;
          }
        })}
      </div> `;
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
    removeWordBlock();
    const wordBlock = document.createElement('hooli-wordinfo-block');
    // wordBlock.wordObj = this.wordObj;
    wordBlock.className = this.className.replace('h', 'b');
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

    const update = () => {
      computePosition(this, tooltip, {
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
      tooltip.classList.add('show-tooltip');
    };

    const hideTooltip = () => {
      tooltip.classList.remove('show-tooltip');
    };
    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
    ].forEach(([event, listener]) => {
      this.addEventListener(event, listener);
    });
    this.addEventListener('click', this.openWordBlock);
  }
}

customElements.define('hooli-text', HooliText);
