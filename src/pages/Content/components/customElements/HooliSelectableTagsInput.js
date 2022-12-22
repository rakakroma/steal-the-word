import {
  CancelIcon,
  CheckmarkIcon,
  CloseIcon,
} from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { iconButtonStyle } from './wordInfoBlockStyles';
import { rgbFromString } from '../../../../utilsForAll/rgbFromString';

const isElementInViewport = (element, container) => {
  var containerRect = container.getBoundingClientRect();
  var elementRect = element.getBoundingClientRect();

  // check if the element is within the container's viewport
  return (
    elementRect.top >= containerRect.top &&
    elementRect.left >= containerRect.left &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.right <= containerRect.right
  );
};

class HooliSelectableTagsInput extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
      selectedoptions: { type: Array },
      _inputValue: { state: true },
      _selectingOptionIndex: { state: true },
      _showSuggestions: { state: true },
    };
  }

  constructor() {
    super();
    this.options = [];
    this.selectedoptions = [];
    this._selectingOptionIndex = 0;
    this._showSuggestions = false;
  }

  static styles = [
    css`
      .text-input-with-options {
        align-items: center;
        position: relative;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
          rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
          rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
      }
      .options {
        padding-top: 4px;
        padding-bottom: 4px;
        border-top: 1px solid lightgrey;
        background-color: rgb(249, 249, 249);
        width: 100%;
        max-height: 100px;
        overflow-y: scroll;
      }

      #text-input {
        border: none;
        outline: none;
        display: inline-block;
      }
      #text-input:focus {
        background-color: white;
      }

      .hide {
        display: none;
      }
      .submit-section {
        display: inline-block;
      }
    `,
    iconButtonStyle,
  ];

  render() {
    const optionsListClassName = this._showSuggestions
      ? 'options'
      : 'options hide';
    return html`
      <div class="text-input-with-options" @focusin=${this._handleFocusIn}>
        ${this.selectedoptions.map((option, index) => {
          return html`<hooli-tag
            taglabel=${option}
            selectable="true"
            @click="${() => this._handleClickDelete(index)}"
            deletable="true"
          ></hooli-tag>`;
        })}
        <input
          autocomplete="off"
          id="text-input"
          type="text"
          placeholder="search/create new tag"
          value=${this._inputValue}
          @input=${this._handleInput}
          @keyup=${this._handleKeyUp}
          @keydown=${this._handleKeySelectOption}
        />
        <div class="submit-section">
          <button class="icon-button">
            ${CancelIcon({ width: 15, height: 15 })}
          </button>
          <button class="icon-button" @click=${() => this._submitResult()}>
            ${CheckmarkIcon({ width: 15, height: 15 })}
          </button>
        </div>
        <div class=${optionsListClassName} id="options-list">
          ${this._filteredOptions().map((option, index) => {
            const isSelectedOption = this._selectingOptionIndex === index;
            return html`<hooli-tag
              taglabel=${option}
              selectable="true"
              .selecting=${isSelectedOption}
              @click=${() => this._handleAddSelectedOption(option)}
            ></hooli-tag>`;
          })}
          <hooli-tag
            class=${!this._showNewOption() && 'hide'}
            selectable="true"
            .selecting=${this._selectingOptionIndex ===
            this._filteredOptions().length}
            taglabel=${'create "' + this._inputValue + '"'}
          ></hooli-tag>
        </div>
      </div>
    `;
  }

  _handleFocusIn = (e) => {
    console.log('in');
    this._showOptionsList(true);
  };

  _filteredOptions() {
    if (!this._inputValue && this.selectedoptions.length === 0)
      return this.options;

    const getIncludesInputStringOption = (option) =>
      option.toLowerCase().includes(this._inputValue.toLowerCase());
    const noSelectedOption = (option) => !this.selectedoptions.includes(option);

    if (!this._inputValue)
      return this.options.filter((option) => noSelectedOption(option));

    if (this.selectedoptions.length === 0)
      return this.options.filter((option) =>
        getIncludesInputStringOption(option)
      );

    return this.options.filter((option) => {
      return getIncludesInputStringOption(option) && noSelectedOption(option);
    });
  }

  _showNewOption() {
    const trimmedValue = this._inputValue?.trim();
    return (
      trimmedValue &&
      !this.options.includes(trimmedValue) &&
      !this.selectedoptions.includes(trimmedValue)
    );
  }

  _showOptionsList = (boolean) => {
    const displayIt = boolean !== false;
    if (this._showSuggestions !== displayIt) {
      this._showSuggestions = displayIt;
      this._selectingOptionIndex = -1;
    }
  };

  _handleKeyUp(e) {
    if (e.key === 'Escape') {
      this._inputValue = '';
      this.shadowRoot.querySelector('#text-input').value = '';
      this._showOptionsList(false);
    }
    if (e.key !== 'Enter') return;
    let newSelectedOption = this._filteredOptions()[this._selectingOptionIndex];
    if (
      !newSelectedOption &&
      this._selectingOptionIndex === this._filteredOptions().length &&
      this._showNewOption()
    ) {
      newSelectedOption = e.target.value.trim();
    }
    if (!newSelectedOption) {
      this._submitResult();
      return;
    }
    this._handleAddSelectedOption(newSelectedOption);
    this._selectingOptionIndex = 0;
    this.shadowRoot.querySelector('#text-input').value = '';
    this._inputValue = '';
  }

  _handleInput(event) {
    this._inputValue = event.target.value;
    this._showOptionsList(true);
    this._selectingOptionIndex = 0;
  }

  _handleAddSelectedOption(option) {
    console.log(`select ${option}`);
    this.selectedoptions = this.selectedoptions.concat(option);
  }

  _handleKeySelectOption(e) {
    if (e.key === 'Backspace') {
      if (this._inputValue || this.selectedoptions.length === 0) return;
      this.selectedoptions = this.selectedoptions.slice(
        0,
        this.selectedoptions.length - 1
      );
      this._showOptionsList(false);
    }
    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;
    this._showOptionsList(true);
    e.preventDefault();
    const optionsLength = this._filteredOptions().length;
    const selectableLength = this._showNewOption()
      ? optionsLength
      : Math.max(optionsLength - 1, 0);
    if (e.key === 'ArrowUp') {
      switch (this._selectingOptionIndex) {
        case 0:
        case -1:
          this._selectingOptionIndex = selectableLength;
          break;
        default:
          this._selectingOptionIndex -= 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (this._selectingOptionIndex === selectableLength) {
        this._selectingOptionIndex = 0;
      } else {
        this._selectingOptionIndex += 1;
      }
    }
    const optionsList = this.renderRoot.querySelector('#options-list');
    const targetEle = optionsList.children[this._selectingOptionIndex];
    if (!isElementInViewport(targetEle, optionsList)) {
      targetEle.scrollIntoView({ block: 'nearest' });
    }
    console.log(this._selectingOptionIndex, selectableLength);
  }

  _handleClickDelete(index) {
    const newSelected = [...this.selectedoptions];
    newSelected.splice(index, 1);
    this.selectedoptions = newSelected;
    this._showOptionsList(false);
  }

  _submitResult() {
    const eventOptions = {
      detail: { selectedoptions: this.selectedoptions },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('submittags', eventOptions));
  }

  firstUpdated() {
    const handleClickOutside = (e) => {
      const showIt = e.composedPath().some((node) => node === this);
      if (showIt === false) {
        this._showOptionsList(showIt);
      }
    };

    const wordBlock = document.querySelector('hooli-wordinfo-block');
    this.requestUpdate().then(() => {
      wordBlock.addEventListener('click', handleClickOutside);
    });
  }
}
customElements.define('hooli-selectable-tags-input', HooliSelectableTagsInput);

class HooliTags extends LitElement {
  static get properties() {
    return {
      tags: { type: Array },
    };
  }

  constructor() {
    super();
    this.tags = [];
  }
  // static styles = [
  //   css`
  //     .tag {
  //       border-radius: 4px;
  //       margin-left: 4px;
  //       margin-right: 4px;
  //     }
  //   `,
  // ];

  render() {
    return html`<div class="tags-container">
      ${this.tags.map((tag) => {
        // const stringColor = rgbFromString(tag, 0.1);

        return html`<hooli-tag taglabel=${tag}></hooli-tag>`;
        // return html`<span style="background-color:${stringColor}" class="tag"
        //   >${tag}</span
        // >`;
      })}
    </div>`;
  }
}

customElements.define('hooli-tags', HooliTags);

class HooliTag extends LitElement {
  static get properties() {
    return {
      taglabel: { type: String },
      selectable: { type: Boolean },
      selecting: { type: Boolean },
      deletable: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.taglabel = '';
    this.selectable = false;
    this.selecting = false;
    this.deletable = false;
  }
  static styles = [
    css`
      .tag {
        user-select: none;
        border-radius: 4px;
        margin-left: 4px;
        margin-right: 4px;
        padding-left: 4px;
        padding-right: 4px;
        transition: all 0.15s ease-in-out 0s;
      }
      .selectable {
        cursor: pointer;
      }
      .selectable:hover {
        filter: contrast(0.5);
        border: 1px solid black;
      }
      .selecting {
        box-shadow: 3px 3px 4px;
        border: 1px solid black;
      }
      .hide-icon {
        vertical-align: middle;
        display: none;
      }
      .tag:hover .hide-icon {
        display: inline-block;
      }
    `,
  ];

  render() {
    const stringColor = rgbFromString(this.taglabel, 0.2);
    const eleClassName = () => {
      const initialClassName = ['tag'];
      if (this.selectable) initialClassName.push('selectable');
      if (this.selecting) initialClassName.push('selecting');
      // if (this.deletable) initialClassName.push('deletable');
      return initialClassName.join(' ');
    };
    return html`<span
      class=${eleClassName()}
      style="background-color:${stringColor}"
      >${this.taglabel}
      ${this.deletable
        ? html`<span class="hide-icon">
            ${CloseIcon({ width: 12, height: 12 })}</span
          >`
        : ''}
    </span>`;
  }
}

customElements.define('hooli-tag', HooliTag);
