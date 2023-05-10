import '@webcomponents/custom-elements';
import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../redux/store';
import {
  colorAndTextStyle,
  zIndexStyle,
} from './WordBlock/wordInfoBlockStyles';

class HooliWordListMinimizedBar extends connect(store)(LitElement) {
  get properties() {
    return {
      listLength: { type: Number },
      mode: { type: String },
    };
  }

  constructor() {
    super();
    this.mode = '';
  }

  stateChanged(state) {
    this.listLength = state.displayingWordList.length;
  }
  static styles = [
    zIndexStyle,
    colorAndTextStyle,
    css`
      :host {
        width: 40px;
        height: 25px;
        background-color: rgb(213 213 213);
        box-shadow: rgb(0 0 0 / 41%) 0px 3.1px 7.1px;
        position: fixed;
        right: 64px;
        bottom: 0;
        z-index: var(--lower-z-index);
        padding: 2px 5px 0 5px;
        border-radius: 3px 3px 0 0;
        font-weight: 600;
      }
      :host(:hover) {
        background-color: #e8e8e8d3;
        user-select: none;
        cursor: pointer;
      }
      #count-word {
        font-size: 17px;
        text-align: center;
      }
      div {
        font-family: var(--hooli-font-family);
        font-size: 17px;
        color: #0d925b;
      }
    `,
  ];

  render() {
    return html`<div @click="${this._handleOpenWordList}">
      <div id="count-word">${this.listLength}</div>
    </div>`;
  }
  _handleOpenWordList() {
    const wordList = document.createElement('hooli-floating-word-list');
    document.body.appendChild(wordList);
    this.remove();
  }
}

customElements.define(
  'hooli-wordlist-minimized-bar',
  HooliWordListMinimizedBar
);
