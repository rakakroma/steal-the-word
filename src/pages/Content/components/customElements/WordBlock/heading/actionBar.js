import {
  BoxAddIcon,
  DeleteIcon,
  EditIcon,
  FindAndReplaceIcon,
  GlobeSearchIcon,
} from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';
import { get, translate } from 'lit-translate';

export const actionBar = (wordBlock) => {
  const tooltipedButton = (tooltipText, iconImg, clickFunc) => {
    return html` <hooli-tooltip text=${tooltipText}>
      <button type="button" class="icon-button" @click="${clickFunc}">
        ${iconImg}
      </button>
    </hooli-tooltip>`;
  };

  const variantsAndMatchRuleButton = tooltipedButton(
    get('tooltipText.addMatchRule'),
    FindAndReplaceIcon({ width: 15, height: 15 }),
    () => wordBlock._handleUpdateFormStatus('openMatchRule')
  );

  const searchLinkButton = html`
              <hooli-tooltip text="${translate('tooltipText.searchWord', {
                theWord: wordBlock.newWord || wordBlock.wordObj.word,
              })}">
              <a href=https://www.google.com/search?q=${
                wordBlock.newWord || wordBlock.wordObj.word
              } target="_blank" >       
              ${GlobeSearchIcon({ width: 15, height: 15 })}
              </hooli-tooltip>
              </a>`;

  const newContextButton = tooltipedButton(
    get('tooltipText.addNewContext'),
    BoxAddIcon({ width: 15, height: 15 }),
    () => (wordBlock.mode = 'newContext')
  );
  const editIcon = tooltipedButton(
    get('tooltipText.editWord'),
    EditIcon({ width: 15, height: 15 }),
    () => (wordBlock.mode = 'editWord')
  );
  if (['editWord', 'newWord'].includes(wordBlock.mode))
    return html`${searchLinkButton} ${variantsAndMatchRuleButton}`;

  if (wordBlock.mode === 'newContext') return html`${searchLinkButton}`;

  if (wordBlock.mode === 'lookUp')
    return html` ${searchLinkButton}${newContextButton}${editIcon}
      <hooli-menu>
        <li slot="list-item" @click="${() => (wordBlock.mode = 'deleting')}">
          ${DeleteIcon({ width: 15, height: 15 })}
          ${translate('button.deleting')}
        </li>
      </hooli-menu>`;
};
