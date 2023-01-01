import { InfoIcon } from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';

//todo: select the default match rule
export const matchRuleSelection = (stem, variants, matchRule) => {
  const variantsInput = () => {
    return html`
       <input id='stem-input' name='stem' class='editable' type='text' placeholder='stem' autocomplete="off" .value="${
         stem || ''
       }"></input>
       <hooli-variants-input placeholder='variants' id='variants-input' .tags=${
         variants || []
       } ></hooli-variants-input>`;
  };

  // if (this._formInputStatus.openMatchRule) {
  // setTimeout(() => {
  //   this.renderRoot.querySelector(
  //     `#${this.wordObj?.matchRule || 'start'}`
  //   ).checked = true;
  // });

  const radioButtonWithToolTip = (value, isChecked) => {
    return html`<hooli-tooltip>
        <hooli-highlighter  
        slot='tooltip-content'
        text="the @reallycoolguy in cooler is not supercool but that's cool"
         matchword='cool'
         matchrule=${value}
         ></hooli-highlighter>
        <input type='radio' name='match-rule' id=${value} value=${value} .checked=${isChecked}></input>
        <label for=${value}>${value}</label>
        </hooli-tooltip>`;
  };

  return html`
    <div id="match-rule-selection-container">
      <h6>
        Match Rule:
        <hooli-tooltip>
          <span class="icon-button"
            >${InfoIcon({ width: 13, height: 13 })}</span
          >
        </hooli-tooltip>
      </h6>
      <div>
        ${['start', 'end', 'independent', 'any'].map((value) => {
          const isChecked = 'start';
          return html` ${radioButtonWithToolTip(value, isChecked)}`;
        })}
      </div>
      <div>${variantsInput()}</div>
    </div>
  `;
  // }
};
