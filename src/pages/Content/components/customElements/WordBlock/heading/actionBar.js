import {
  BoxAddIcon,
  DeleteIcon,
  EditIcon,
  FindAndReplaceIcon,
  GlobeSearchIcon,
} from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';

export const actionBar = (wordBlock) => {
  const tooltipedButton = (tooltipText, iconImg, clickFunc) => {
    return html` <hooli-tooltip text=${tooltipText}>
      <button type="button" class="icon-button" @click="${clickFunc}">
        ${iconImg}
      </button>
    </hooli-tooltip>`;
  };

  const variantsAndMatchRuleButton = tooltipedButton(
    'add match rule',
    FindAndReplaceIcon({ width: 15, height: 15 }),
    () => wordBlock._handleUpdateFormStatus('openMatchRule')
  );
  const searchLinkButton = html`
              <hooli-tooltip text='search wordBlock word in Google'>
              <a href=https://www.google.com/search?q=${
                wordBlock.newWord || wordBlock.wordObj.word
              } target="_blank" >       
              ${GlobeSearchIcon({ width: 15, height: 15 })}
              </hooli-tooltip>
              </a>`;

  const newContextButton = tooltipedButton(
    'add new context',
    BoxAddIcon({ width: 15, height: 15 }),
    () => (wordBlock.mode = 'newContext')
  );
  const editIcon = tooltipedButton(
    'edit word and annotation',
    EditIcon({ width: 15, height: 15 }),
    () => (wordBlock.mode = 'editWord')
  );
  if (['editWord', 'newWord'].includes(wordBlock.mode))
    return html`${searchLinkButton} ${variantsAndMatchRuleButton}`;

  if (wordBlock.mode === 'newContext') return html`${searchLinkButton}`;

  if (wordBlock.mode === 'lookUp')
    return html` ${searchLinkButton} ${newContextButton}${editIcon}
      <hooli-menu>
        <li slot="list-item" @click="${() => (wordBlock.mode = 'deleting')}">
          ${DeleteIcon({ width: 15, height: 15 })} Delete
        </li>
      </hooli-menu>`;
};
