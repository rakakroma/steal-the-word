import { StarIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';

class HooliStarDisplay extends LitElement {
  static get properties() {
    return {
      stars: { type: Number },
    };
  }

  static styles = [
    css`
      #container {
        color: #f76583;
      }
    `,
  ];
  render() {
    if (this.stars === 1) {
      return html` <span id="container">
        ${StarIcon({ width: 15, height: 15 })}
      </span>`;
    }
    if (this.stars === 2) {
      return html` <span id="container">
        ${StarIcon({ width: 15, height: 15 })}
        ${StarIcon({ width: 13, height: 13 })}
      </span>`;
    }
    if (this.stars === 3) {
      return html` <span id="container">
        ${StarIcon({ width: 15, height: 15 })}
        ${StarIcon({ width: 13, height: 13 })}
        ${StarIcon({ width: 13, height: 13 })}
      </span>`;
    }
    return null;
  }
}

customElements.define('hooli-star-display', HooliStarDisplay);
