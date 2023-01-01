import '@webcomponents/custom-elements';
import { LitElement, html, css } from 'lit';
import { getRegexByMatchRule } from '../../../utils/matchRule';

class HooliHighlighter extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      matchword: { type: String },
      matchRule: { type: String },
    };
  }
  constructor() {
    super();
    this.text = '';
    this.matchword = '';
    this.matchRule = 'any';
  }

  static styles = [
    css`
      .matched-word {
        background: linear-gradient(transparent 40%, #eea3a361 30%);
      }
    `,
  ];

  render() {
    return html`${this._highlightedText()}`;
  }

  _highlightedText() {
    if (!this.matchword?.trim()) return html`${this.text}`;

    const regex = new RegExp(
      getRegexByMatchRule(this.matchword, this.matchRule),
      'gi'
    );

    const parts = this.text.split(regex);
    const matched = this.text.match(regex);
    if (parts.length === 1) return html`${this.text}`;

    return html`
      ${parts.map((part, i) => {
        if (i === parts.length - 1) {
          return html`${part}`;
        }
        return html`${part}<span class="matched-word">${matched[i]}</span>`;
      })}
    `;
  }
}

customElements.define('hooli-highlighter', HooliHighlighter);

export default HooliHighlighter;
