import { CloseIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { rgbFromString } from '../../../../../utilsForAll/rgbFromString';

class HooliTag extends LitElement {
  static get properties() {
    return {
      taglabel: { type: String },
      selectable: { type: Boolean },
      selecting: { type: Boolean },
      deletable: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.taglabel = '';
    this.selectable = false;
    this.selecting = false;
    this.deletable = false;
  }
  static styles = [
    css`
      .tag {
        user-select: none;
        border-radius: 4px;
        margin-left: 4px;
        margin-right: 4px;
        padding-left: 4px;
        padding-right: 4px;
        transition: all 0.15s ease-in-out 0s;
      }
      .selectable {
        cursor: pointer;
      }
      .selectable:hover {
        filter: contrast(0.5);
        border: 1px solid black;
      }
      .selecting {
        box-shadow: 3px 3px 4px;
        border: 1px solid black;
      }
      .hide-icon {
        vertical-align: middle;
        display: none;
      }
      .tag:hover .hide-icon {
        display: inline-block;
      }
    `,
  ];

  render() {
    const stringColor = rgbFromString(this.taglabel, 0.2);
    const eleClassName = () => {
      const initialClassName = ['tag'];
      if (this.selectable) initialClassName.push('selectable');
      if (this.selecting) initialClassName.push('selecting');
      // if (this.deletable) initialClassName.push('deletable');
      return initialClassName.join(' ');
    };
    return html`<span
      class=${eleClassName()}
      style="background-color:${stringColor}"
      >${this.taglabel}
      ${this.deletable
        ? html`<span class="hide-icon">
            ${CloseIcon({ width: 12, height: 12 })}</span
          >`
        : ''}
    </span>`;
  }
}
customElements.define('hooli-tag', HooliTag);
