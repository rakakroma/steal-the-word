import {
  StarIcon,
  StarOutlineIcon,
} from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';
import { updateWordRating } from '../../../../../Background/handler/updateData';
import { submitAndExecute } from '../form/submitAndExecute';

export const starRating = (wordBlock) => {
  if (wordBlock.mode !== 'lookUp') return;
  const starCount = wordBlock.wordObj?.stars;
  const outlineStar = StarOutlineIcon({ width: 15, height: 15 });
  const filledStar = StarIcon({ width: 15, height: 15 });

  const starButton = (targetNum) => {
    const filled = starCount >= targetNum;
    const handleUpdateRating = (targetNum) => {
      let updateValue = targetNum;
      if (targetNum === starCount) {
        updateValue = 0;
      }

      const request = {
        action: updateWordRating,
        rating: updateValue,
        wordId: wordBlock.wordObj.id,
      };
      submitAndExecute(wordBlock, request, (res) => {
        // store.dispatch(
        //   updateOneWord({ ...wordBlock.wordObj, stars: updateValue })
        // );
      });
    };
    return html`<button
      type="button"
      class="rating-button"
      @click="${() => handleUpdateRating(targetNum)}"
    >
      ${filled ? filledStar : outlineStar}
    </button>`;
  };
  return html`<div>${starButton(1)} ${starButton(2)} ${starButton(3)}</div>`;
};
