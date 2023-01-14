import {
  CancelIcon,
  CheckmarkIcon,
} from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { iconButtonStyle } from './wordInfoBlockStyles';
import { classMap } from 'lit/directives/class-map.js';

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
      selectedOptions: { type: Array },
      _inputValue: { state: true },
      _selectingOptionIndex: { state: true },
      _showSuggestions: { state: true },
    };
  }

  constructor() {
    super();
    this.options = [];
    this.selectedOptions = [];
    this._selectingOptionIndex = 0;
    this._showSuggestions = true;
  }

  static styles = [
    css`
      .text-input-with-options {
        align-items: center;
        position: relative;
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
        outline: grey solid 1px;
        display: inline-block;
        background-color: white;
        color: black;
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
    const optionsListClassName = {
      options: true,
      hide: !this._showSuggestions,
    };
    const addNewOptionClassName = {
      hide: !this._showNewOption(),
    };
    return html`
      <div class="text-input-with-options">
        ${this.selectedOptions.map((option, index) => {
          return html`<hooli-tag
            .tagLabel=${option}
            ?selectable=${true}
            @click="${() => this._handleClickDelete(index)}"
            ?deletable=${true}
          ></hooli-tag>`;
        })}
        <input
          autocomplete="off"
          id="text-input"
          type="text"
          placeholder="search/create new tag"
          value=${this._inputValue}
          @input=${this._handleInput}
          @keydown=${this._handleKeySelectOption}
          @focus=${(e) => {
            this._showOptionsList(true);
          }}
        />
        <div class="submit-section">
          <button class="icon-button" @click=${this._submitCancel}>
            ${CancelIcon({ width: 15, height: 15 })}
          </button>
          <button class="icon-button" @click=${this._submitResult}>
            ${CheckmarkIcon({ width: 15, height: 15 })}
          </button>
        </div>
        <div class=${classMap(optionsListClassName)} id="options-list">
          ${this._filteredOptions().map((option, index) => {
            const isSelectedOption = this._selectingOptionIndex === index;
            return html`<hooli-tag
              .tagLabel=${option}
              ?selectable=${true}
              .selecting=${isSelectedOption}
              @click=${() => this._handleAddSelectedOption(option)}
            ></hooli-tag>`;
          })}
          <hooli-tag
            class=${classMap(addNewOptionClassName)}
            ?selectable=${true}
            .selecting=${this._selectingOptionIndex ===
            this._filteredOptions().length}
            .tagLabel=${'create "' + this._inputValue + '"'}
          ></hooli-tag>
        </div>
      </div>
    `;
  }

  _filteredOptions() {
    if (!this._inputValue && this.selectedOptions.length === 0)
      return this.options;

    const getIncludesInputStringOption = (option) =>
      option.toLowerCase().includes(this._inputValue.toLowerCase());
    const noSelectedOption = (option) => !this.selectedOptions.includes(option);

    if (!this._inputValue)
      return this.options.filter((option) => noSelectedOption(option));

    if (this.selectedOptions.length === 0)
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
      !this.selectedOptions.includes(trimmedValue)
    );
  }

  _showOptionsList = (boolean) => {
    const displayIt = boolean !== false;
    if (this._showSuggestions !== displayIt) {
      this._showSuggestions = displayIt;
      this._selectingOptionIndex = -1;
    }
  };

  _handleInput(event) {
    this._inputValue = event.target.value;
    this._showOptionsList(true);
    this._selectingOptionIndex = 0;
  }

  _handleAddSelectedOption(option) {
    this.selectedOptions = this.selectedOptions.concat(option);
  }

  _handleKeySelectOption(e) {
    if (e.isComposing) {
      return;
    }
    if (e.key === 'Escape') {
      this._inputValue = '';
      this.shadowRoot.querySelector('#text-input').value = '';
      this._showOptionsList(false);
      return;
    }

    if (e.key === 'Enter') {
      let newSelectedOption =
        this._filteredOptions()[this._selectingOptionIndex];
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
      this._showOptionsList(false);

      return;
    }
    if (e.key === 'Backspace') {
      if (this._inputValue || this.selectedOptions.length === 0) return;
      this.selectedOptions = this.selectedOptions.slice(
        0,
        this.selectedOptions.length - 1
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
  }

  _handleClickDelete(index) {
    const newSelected = [...this.selectedOptions];
    newSelected.splice(index, 1);
    this.selectedOptions = newSelected;
    this._showOptionsList(false);
  }

  _submitCancel() {
    const eventOptions = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('cancel-input', eventOptions));
  }
  _submitResult() {
    const newAddedOptions = this.selectedOptions.filter((option) => {
      return this.options.findIndex((tagName) => tagName === option) === -1;
    });
    const eventOptions = {
      detail: { selectedOptions: this.selectedOptions, newAddedOptions },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('submit-tags', eventOptions));
  }

  firstUpdated() {
    const handleClickOutside = (e) => {
      const showIt = e.composedPath().some((node) => node === this);
      if (showIt === false) {
        this._showOptionsList(false);
      }
    };

    const wordBlock = document.querySelector('hooli-wordinfo-block');
    // this.requestUpdate().then(() => {
    wordBlock.addEventListener('click', handleClickOutside);
    // });
  }
}
customElements.define('hooli-selectable-tags-input', HooliSelectableTagsInput);
