import { InfoIcon } from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';
import { translate } from 'lit-translate';
import { isLangsNotUseSpaceRegex } from '../../../../../../utilsForAll/regexCheckLang';

const variantsInput = (stem, variants) => {
  return html`
     <input id='stem-input' name='stem' class='editable' type='text' placeholder=${translate(
       'placeholder.stem'
     )} autocomplete="off" .value="${stem || ''}"></input>
     <hooli-variants-input placeholder="${translate(
       'placeholder.variants'
     )}" id='variants-input' .tags=${variants || []} ></hooli-variants-input>`;
};

const radioButtonWithToolTip = (value, isChecked, isDisabled) => {
  return html`<hooli-tooltip>
      <hooli-highlighter  
      slot='tooltip-content'
      text="example: cool, supercool, cooler, somecoolstuff"
       .matchWord=${'cool'}
       ?darkmode=${true}
       .matchRule=${value}
       ></hooli-highlighter>
      <input type='radio' name='match-rule' id=${value} value=${value} ?checked=${isChecked} ?disabled=${isDisabled}></input>
      <label for=${value}>
      ${translate(`matchRule.${value}`)}
      </label>
      </hooli-tooltip>`;
};

export const matchRuleSelection = (word, stem, variants, matchRule) => {
  let isDisabled = false;

  let text = 'tooltipText.defaultMatchRuleExplanation';
  if (isLangsNotUseSpaceRegex.test(word)) {
    isDisabled = true;
    text = 'tooltipText.CJKMatchRuleExplanation';
  }

  console.log(`${word} ${isLangsNotUseSpaceRegex.test(word)}`);
  return html`
    <div id="match-rule-selection-container">
      <h6>
        ${translate('matchRule.title')}:
        <hooli-tooltip>
          <div slot="tooltip-content">${translate(text)}</div>
          <span class="icon-button"
            >${InfoIcon({ width: 13, height: 13 })}</span
          >
        </hooli-tooltip>
      </h6>
      <div>
        ${['start', 'end', 'independent', 'any'].map((value) => {
          let isChecked = false;
          if (isDisabled && value === 'any') {
            isChecked = true;
          } else if (matchRule && matchRule === value) {
            isChecked = true;
          } else if (value === 'start') isChecked = true;
          return html` ${radioButtonWithToolTip(value, isChecked, isDisabled)}`;
        })}
      </div>
      <div>${variantsInput(stem, variants)}</div>
    </div>
  `;
};
