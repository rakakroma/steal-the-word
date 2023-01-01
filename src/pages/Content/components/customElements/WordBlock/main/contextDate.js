import { html } from 'lit';
import dayjs from 'dayjs';

export const contextDate = (date) => {
  return html`<span class="date"
    >${dayjs(date).isSame(dayjs(), 'year')
      ? dayjs(date).format('MMM D')
      : dayjs(date).format('MMM D,YY')}</span
  > `;
};
