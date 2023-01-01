import { html } from 'lit';
import { actionBar } from './actionBar';
import { starRating } from './starRating';
import { wordSection } from './wordSection';

export const headingElement = (wordBlock) => {
  return html`
    <div id="heading-left">
      ${wordSection(wordBlock)} ${starRating(wordBlock)}
    </div>
    <div id="action-bar">${actionBar(wordBlock)}</div>
  `;
};
