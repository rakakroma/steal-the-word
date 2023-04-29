import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  MinimizeIcon,
  RefreshIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from '@spectrum-web-components/icons-workflow';
import interact from 'interactjs';
import { css, html, LitElement } from 'lit';
import { connect } from 'pwa-helpers';
import {
  clearNoLongerExistWordInWordInPageList,
  getWordObjsOfDisplayingWordList,
} from '../../redux/displayingWordListSlice';
import { store } from '../../redux/store';
import { getTagList } from '../../redux/wordDataSlice';
import {
  colorAndTextStyle,
  zIndexStyle,
} from './WordBlock/wordInfoBlockStyles';
import { transformElementId } from '../../utils/transformElementId';
import './HooliStarDisplay';

class HooliFloatingWordList extends connect(store)(LitElement) {
  static get properties() {
    return {
      wordInPageList: { type: Array },
      lookingWord: { state: true },
      tagList: { type: Array },
      _openWordBlockWhenMatching: { state: true },
    };
  }

  constructor() {
    super();
    this.lookingWord = null;
    this._openWordBlockWhenMatching = true;
  }

  stateChanged(state) {
    this.wordInPageList = getWordObjsOfDisplayingWordList(state);
    this.tagList = getTagList(state);
  }

  static styles = [
    zIndexStyle,
    colorAndTextStyle,
    css`
      :host {
        all: initial;
        width: 200px;
        position: fixed;
        top: 50px;
        right: 20px;
        z-index: var(--lower-z-index);
        overflow-y: overlay;
        display: flex;
        flex-direction: column;
        border-radius: 7px;
      }

      #word-list-container {
        border: 1px solid grey;
        border-radius: 7px;
        background-color: var(--block-background-color);
        color: var(--block-text-color);
        font-family: var(--hooli-font-family);
      }
      #content-container {
        padding: 3px;
        max-height: 630px;
        overflow: scroll;
      }
      #title-bar {
        background: rgb(175, 211, 207);
        padding-top: 6px;
        border-radius: 7px 7px 0 0;
      }
      ul {
        padding: 0;
        list-style-type: none;
        margin: 0;
      }
      li {
        margin: 10px;
      }

      h3,
      h5,
      h6 {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
          Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
        margin: 0;
        font-weight: 400;
      }
      h3 {
        font-size: 17px;
      }
      h6 {
        font-size: 13px;
      }
      h5 {
        font-size: 14px;
      }

      button {
        border: none;
        background: none;
        color: black;
      }
      button:hover {
        color: #8f7d7d;
        cursor: pointer;
      }

      .word-count {
        font-size: 12px;
        color: gray;
        border-radius: 5px;
        border: 1px solid black;
        position: absolute;
        right: -24px;
        top: 5px;
        display: inline-block;
        padding-left: 3px;
        padding-right: 3px;
        visibility: hidden;
      }
      .word-span {
        position: relative;
        cursor: pointer;
      }
      #looking-for-match-bar {
        display: flex;
        color: black;
      }
      #looking-for-match-bar > h6 {
        color: grey;
      }
      #looking-for-match-bar > h5 {
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 6px;
      }
    `,
  ];

  _titleBar() {
    return html`<div id="title-bar">
      <hooli-tooltip text="refresh">
        <button class="title-action" @click="${this._handleRefresh}">
          ${RefreshIcon({ width: 15, height: 15 })}
        </button>
      </hooli-tooltip>
      <hooli-tooltip text="minimize">
        <button class="title-action" @click="${this._handleMinimize}">
          ${MinimizeIcon({ width: 15, height: 15 })}
        </button>
      </hooli-tooltip>
      <hooli-tooltip text="close">
        <button class="title-action" @click="${this._handleClose}">
          ${CloseIcon({ width: 15, height: 15 })}
        </button>
      </hooli-tooltip>
    </div>`;
  }

  _wordList() {
    return html`<ul>
      ${this.wordInPageList.map((wordObj) => {
        return html`<li>
            <h3
              class="word-h3"
              @mouseover="${() => this._handleShowCount(wordObj.id)}"
              @mouseout="${() => this._handleHideCount(wordObj.id)}"
            >
              <span
                class="word-span"
                @click="${() => this._handleStartScrollToWord(wordObj)}"
              >
                ${wordObj.word}
                <hooli-star-display
                  .stars=${wordObj.stars}
                ></hooli-star-display>
                <span class="word-count" id="count-${wordObj.id}"
                  >${wordObj.countInCurrentPage}</span
                >
              </span>
            </h3>
            ${wordObj.definitions.map((definition) => {
              const tagLabels = definition.tags.map(
                (tagId) =>
                  this.tagList.find((tagObj) => tagObj.id === tagId)?.tag ||
                  tagId
              );
              return html`
                <h6>
                  ${definition.annotation}
                  ${tagLabels.map((tagLabel) => {
                    return html`<hooli-tag .tagLabel=${tagLabel}></hooli-tag>`;
                  })}
                </h6>
              `;
            })}
          </li>
          ${this._lookingForMatchBar(wordObj.id)} `;
      })}
    </ul>`;
  }
  _lookingForMatchBar(wordId) {
    if (!this.lookingWord) return;
    if (this.lookingWord.id === wordId) {
      const existingEleIdsCount = Array.from(
        document.querySelectorAll(`.h-${wordId}`)
      ).map((ele) => +transformElementId(ele.id, 'count'));

      return html`<div id="looking-for-match-bar">
        <hooli-tooltip
          text=${this._openWordBlockWhenMatching
            ? 'stop auto show word info'
            : 'auto show word info'}
        >
          <button @click="${this._handleOpenWordBlock}">
            ${this._openWordBlockWhenMatching
              ? VisibilityIcon({ width: 15, height: 15 })
              : VisibilityOffIcon({ width: 15, height: 15 })}
          </button>
        </hooli-tooltip>
        <h6>
          ${existingEleIdsCount.indexOf(this.lookingWord.currentFocusCount) +
          1}/${existingEleIdsCount.length}
        </h6>
        <hooli-tooltip text="scroll to prev">
          <button @click="${() => this._handleScrollToWord('prev')}">
            ${ChevronUpIcon({ width: 15, height: 15 })}
          </button>
        </hooli-tooltip>
        <hooli-tooltip text="scroll to next">
          <button @click="${() => this._handleScrollToWord('next')}">
            ${ChevronDownIcon({ width: 15, height: 15 })}
          </button>
        </hooli-tooltip>
        <button @click="${this._handleStopLooking}">
          ${CloseIcon({ width: 15, height: 15 })}
        </button>
      </div>`;
    }
  }

  render() {
    return html`<div id="word-list-container">
      ${this._titleBar()}
      <div id="content-container">${this._wordList()}</div>
    </div> `;
  }
  gotLookingWord(wordId, currentFocusCount) {
    this.lookingWord = {
      ...this.wordInPageList.find((wordObj) => wordObj.id === wordId),
      currentFocusCount,
    };
  }
  _handleRefresh() {
    clearNoLongerExistWordInWordInPageList();
    if (this.wordInPageList.length === 0) {
      this._handleMinimize('autoOpen');
      return;
    }
  }
  _handleClose() {
    this.remove();
  }

  _handleStartScrollToWord(wordObj) {
    this.lookingWord = { ...wordObj, currentFocusCount: 0 };
    this._handleScrollToWord('next');
  }

  _handleOpenWordBlock() {
    this._openWordBlockWhenMatching = !this._openWordBlockWhenMatching;
    this.requestUpdate();
  }

  _handleScrollToWord(direction, loop) {
    let targetEle;
    let i;
    // if(this.lookingWord.countInCurrentPage === 1) return
    if (direction === 'next') {
      if (!loop) {
        i = this.lookingWord.currentFocusCount + 1;
      } else {
        i = 0;
      }
      for (i; i <= this.lookingWord.countInCurrentPage; i++) {
        targetEle = document.getElementById(`h-${this.lookingWord.id}-${i}`);
        if (targetEle && targetEle.getBoundingClientRect().width > 0) break;
      }
    }
    if (direction === 'prev') {
      if (!loop) {
        i = this.lookingWord.currentFocusCount - 1;
      } else {
        i = this.lookingWord.countInCurrentPage;
      }
      for (i; i >= 1; i--) {
        targetEle = document.getElementById(`h-${this.lookingWord.id}-${i}`);
        if (targetEle && targetEle.getBoundingClientRect().width > 0) break;
      }
    }

    if (!targetEle && !loop) this._handleScrollToWord(direction, true);

    if (!targetEle) {
      this._handleRefresh();
    }
    if (targetEle) {
      this.lookingWord.currentFocusCount = i;
      this.requestUpdate();
      targetEle.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      if (this._openWordBlockWhenMatching) targetEle.openWordBlock();
    }
  }
  _handleShowCount(wordId) {
    this.renderRoot.getElementById(`count-${wordId}`).style.visibility =
      'visible';
  }
  _handleHideCount(wordId) {
    this.renderRoot.getElementById(`count-${wordId}`).style.visibility =
      'hidden';
  }

  _handleStopLooking() {
    this.lookingWord = null;
    this.requestUpdate();
  }

  _handleMinimize(mode) {
    const minimizedComponent = document.createElement(
      'hooli-wordlist-minimized-bar'
    );
    if (mode === 'autoOpen') minimizedComponent.mode = 'autoOpen';
    document.body.appendChild(minimizedComponent);
    this.remove();
  }

  connectedCallback() {
    super.connectedCallback();

    const position = { x: 0, y: 0 };
    interact('#title-bar').draggable({
      //comment out to prevent bugs
      // modifiers: [
      //   interact.modifiers.restrictRect({
      //     restriction: 'body',
      //     //   endOnly: true
      //   }),
      // ],
      listeners: {
        move(event) {
          position.x += event.dx;
          position.y += event.dy;
          document.querySelector(
            'hooli-floating-word-list'
          ).style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
      },
    });
  }
}
customElements.define('hooli-floating-word-list', HooliFloatingWordList);
