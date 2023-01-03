import { InfoIcon } from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';
import { isCJKRegex } from '../../../../../../utilsForAll/regexCheckLang';

const variantsInput = (stem, variants) => {
  return html`
     <input id='stem-input' name='stem' class='editable' type='text' placeholder='stem' autocomplete="off" .value="${
       stem || ''
     }"></input>
     <hooli-variants-input placeholder='variants (enter to add more)' id='variants-input' .tags=${
       variants || []
     } ></hooli-variants-input>`;
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
      <label for=${value}>${value}</label>
      </hooli-tooltip>`;
};

export const matchRuleSelection = (word, stem, variants, matchRule) => {
  let isDisabled = false;
  let matchRuleTooltipText = `This app only knows if the string is matched, and if there are spaces next to it. 
  You can select the match rule and it will apply on the word and the variants you provided, to match the text you want, and filter out those you don't like.
  ❗: stem is the text string that always use 'start' as its match rule.
  ❗: all of them are case sensitive.
  `;
  if (isCJKRegex.test(word)) {
    isDisabled = true;
    matchRuleTooltipText = `Text string contains CJK (Chinese /Japanese/ Korean) characters always use 'any' as match rule.`;
  }
  return html`
    <div id="match-rule-selection-container">
      <h6>
        Match Rule:
        <hooli-tooltip>
          <div slot="tooltip-content">${matchRuleTooltipText}</div>
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
