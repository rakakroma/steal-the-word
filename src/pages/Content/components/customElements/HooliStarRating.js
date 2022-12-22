import {
  StarIcon,
  StarOutlineIcon,
} from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';

//TODO: update the local wordList
//TODO: can be turned to zero
//TODO: hover effect
class HooliStarRating extends LitElement {
  static get properties() {
    return {
      rating: { type: Number },
      wordId: { type: String },
    };
  }

  constructor() {
    super();
    this.rating = 0;
    this.wordId = '';
  }
  static styles = [
    css`
      .rating-button {
        color: #ca6512;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
      }
    `,
  ];

  _starButton(targetNum) {
    const outlineStar = StarOutlineIcon({ width: 15, height: 15 });
    const filledStar = StarIcon({ width: 15, height: 15 });

    const filled = this.rating >= targetNum;
    return html`<button
      type="button"
      class="rating-button"
      @click="${() => this._handleUpdateRating(targetNum)}"
    >
      ${filled ? filledStar : outlineStar}
    </button>`;
  }

  render() {
    return html`<div>
      ${this._starButton(1)} ${this._starButton(2)} ${this._starButton(3)}
    </div>`;
  }
  _handleUpdateRating(targetNum) {
    if (targetNum === this.rating) return;
    chrome.runtime.sendMessage(
      {
        action: 'updateWordRating',
        rating: targetNum,
        wordId: this.wordObj.id,
      },
      (response) => {
        if (response.status === 'success') {
          this.wordObj = { ...this.wordObj, stars: targetNum };
        }
      }
    );
  }
}
customElements.define('hooli-star-rating', HooliStarRating);
