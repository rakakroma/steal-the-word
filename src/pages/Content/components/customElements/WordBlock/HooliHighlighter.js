import '@webcomponents/custom-elements';
import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getRegexByMatchRule } from '../../../utils/matchRule';

class HooliHighlighter extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      matchWord: { type: String },
      matchRule: { type: String },
      darkmode: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.text = '';
    this.matchWord = '';
    this.matchRule = 'any';
    this.darkmode = false;
  }

  static styles = [
    css`
      .light-mode-word {
        background: linear-gradient(transparent 40%, #eea3a361 30%);
      }
      .dark-mode-word {
        background: linear-gradient(transparent 40%, rgb(175 29 29 / 84%) 30%);
      }
    `,
  ];

  render() {
    return html`${this._highlightedText()}`;
  }

  _highlightedText() {
    if (!this.matchWord?.trim()) return html`${this.text}`;

    const regex = new RegExp(
      getRegexByMatchRule(this.matchWord, this.matchRule),
      'gi'
    );

    const parts = this.text.split(regex);
    const matched = this.text.match(regex);
    if (parts.length === 1) return html`${this.text}`;
    const theClassName = {
      'dark-mode-word': this.darkmode,
      'light-mode-word': !this.darkmode,
    };
    console.log(`darkmode ${this.darkmode}`);
    return html`
      ${parts.map((part, i) => {
        if (i === parts.length - 1) {
          return html`${part}`;
        }
        return html`${part}<span class=${classMap(theClassName)}
            >${matched[i]}</span
          >`;
      })}
    `;
  }
}

customElements.define('hooli-highlighter', HooliHighlighter);

export default HooliHighlighter;
