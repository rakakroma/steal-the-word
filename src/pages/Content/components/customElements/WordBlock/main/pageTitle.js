import { html } from 'lit';
import {
  LinkPageIcon,
  EditInLightIcon,
  AnchorSelectIcon,
  EditIcon,
} from '@spectrum-web-components/icons-workflow';
import { translate } from 'lit-translate';

const contextOptions = (wordBlock, contextId) => {
  return html`<hooli-menu>
    <span slot="button-text-or-icon"
      >${EditInLightIcon({ width: 13, height: 13 })}</span
    >
    <li
      slot="list-item"
      @click="${() => wordBlock.handlePhraseSelect(contextId)}"
    >
      ${AnchorSelectIcon({ width: 13, height: 13 })}
      ${translate('button.contextHighlight')}
    </li>
    <li
      slot="list-item"
      @click="${() => wordBlock.handleContextEdit(contextId)}"
    >
      ${EditIcon({ width: 13, height: 13 })} ${translate('button.contextEdit')}
    </li>
  </hooli-menu>`;
};

export const pageTitle = (wordBlock, faviconSrc, url, pageTitle, contextId) => {
  return html`<div class="page-title">
    <hooli-tooltip text=${url}>
      <a href=${url} class="context-link"
        >${faviconSrc
          ? html`<img src=${faviconSrc} />`
          : LinkPageIcon({ width: 15, height: 15 })}
      </a>
    </hooli-tooltip>
    <hooli-tooltip text=${pageTitle}>
      <h6>${pageTitle}</h6>
    </hooli-tooltip>
    ${contextId ? html`${contextOptions(wordBlock, contextId)}` : null}
  </div>`;
};
