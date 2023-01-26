import { BoxAddIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { openAddNewWord } from './HooliText';

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
    setTimeout(() => {
      openAddNewWord();
    }, 50);
    setTimeout(() => document.querySelector('hooli-adding-tool')?.remove());
  }
}
customElements.define('hooli-adding-tool', HooliAddingTool);
