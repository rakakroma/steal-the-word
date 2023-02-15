import { computePosition, flip, inline, offset, shift } from '@floating-ui/dom';
import '@webcomponents/custom-elements';
import { css, html, LitElement } from 'lit';
import { connect } from 'pwa-helpers';
import { store } from '../../redux/store';
import { getWordById } from '../../redux/wordDataSlice';
import { getCustomTextStyle } from '../../redux/workingPreferenceSlice';
import { getSentenceFromSelection } from '../../utils/get-selection-more.ts';
import { setWordBlockPosition } from '../../utils/setPosition';
import './HooliWordInfoBlock.js';

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
      customTextStyle: { type: Object },
    };
  }
  stateChanged(state) {
    this.wordObj = getWordById(state, this.className.slice(2));
    this.customTextStyle = getCustomTextStyle(state);
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('customTextStyle')) {
      this.style.setProperty('--hooli-text-color', this.customTextStyle.color);
      this.style.setProperty(
        '--hooli-text-background',
        this.customTextStyle.background || this.customTextStyle.backgroundColor
      );
    }
  }

  static styles = [
    css`
      :host {
        all: initial;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        writing-mode: inherit;
        cursor: pointer;
        color: var(--hooli-text-color);
        background: var(--hooli-text-background);
        white-space: normal;
        display: inline-block;
      }
      #annotation-tip {
        left: 0;
        top: 0;
        position: absolute;
        display: inline-block;
        z-index: 2147483647;
        padding: 3px;
        font-size: 12px;
        line-height: 1.3;
        background: rgb(241, 241, 241);
        color: rgb(0, 0, 0);
        border-radius: 3px;
        transition: 0.1s ease-in;
        opacity: 0;
        visibility: hidden;
        font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        font-style: normal;
        max-width: 450px;
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
        middleware: [
          flip({ fallbackPlacements: ['bottom', 'right'] }),
          offset(3),
          inline(),
          shift({ padding: 5 }),
        ],
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
