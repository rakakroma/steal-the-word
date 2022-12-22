import '@webcomponents/custom-elements';
import {
  AssetsAddedIcon,
  EditIcon,
  CheckmarkIcon,
  CloseIcon,
  BoxAddIcon,
  GlobeSearchIcon,
  GearsAddIcon,
  InfoIcon,
  TextAddIcon,
  DeleteIcon,
  LinkPageIcon,
  AnchorSelectIcon,
  FindAndReplaceIcon,
  EditInLightIcon,
  StarOutlineIcon,
  StarIcon,
  LabelIcon,
  LabelsIcon,
} from '@spectrum-web-components/icons-workflow';
// import { CheckmarkIcon } from '@spectrum-web-components/icons-workflow/src/icons.js';

import { LitElement, html, css } from 'lit';
import dayjs from 'dayjs';
// import { getSentenceFromSelection } from '../../utils/get-selection-more.ts'
import { nanoid } from 'nanoid';
import { myList, newList, tagList } from '../../index';
import { restoreHolliText } from '../../utils/restoreHolliText';
import { renderRuby } from '../../utils/renderRuby';
import { fetchPronInfo } from '../../utils/fetchPronInfo';
import './HolliToolTip';
import './HooliSpinner';
import './HooliSelectableTagsInput';
import { getMatchTextWithIdRef } from '../../../../utilsForAll/getMatchTextWithIdRef';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
import './TestReactComponent';
import { iconButtonStyle, wordInfoBlockStyles } from './wordInfoBlockStyles';
import { currentURL } from '../../utils/currentURL';

const submitAndExecute = (request, successFunc, backupFunc) => {
  console.log(request);
  chrome.runtime.sendMessage(request, (response) => {
    console.log(response);
    if (response.status === 'success') {
      successFunc(response);
    }
    if (typeof backupFunc === 'function') backupFunc(response);
  });
};

const updateWordObjToElementsAndWordList = (wordObj) => {
  const updatedWordObj = { ...wordObj };
  const wordToUpgradeIndex = myList.findIndex(
    (wordObj) => wordObj.id === updatedWordObj.id
  );
  myList[wordToUpgradeIndex] = { ...updatedWordObj };
  document.querySelectorAll(`h-${updatedWordObj.id}`).forEach((ele) => {
    ele.wordObj = { ...updatedWordObj };
  });
};

class HooliWordInfoBlock extends LitElement {
  static get properties() {
    return {
      wordObj: { type: Object },
      contexts: { type: Array },
      contextHere: { type: String },
      imgSrcs: { type: Array },
      mode: { type: String },
      newWord: { type: String },
      _currentSiteIcoSrc: { state: true },
      _phraseSelection: { state: true },
      _formInputStatus: { state: true },
      _workingContext: { state: true },
      _helperText: { state: true },
      _editingTags: { state: true },
    };
  }

  constructor() {
    super();
    this.wordObj = null;
    this.contexts = [];
    this.contextHere = '';
    this.imgSrcs = [];
    this.mode = 'lookUp'; //'lookUp', 'newWord','newContext','editWord','editContext','highlighting'
    this.newWord = '';
    this._currentSiteIcoSrc = '';
    this._phraseSelection = '';
    this._formInputStatus = {
      openMatchRule: false,
      currentMatchRule: '',
      newDefinitionWhenDefinitionSelecting: false,
    };
    this._workingContext = null;
    this._helperText = '';
    this._editingTags = '';
    ['keydown', 'keyup', 'keypress'].forEach((event) => {
      this.addEventListener(event, this._stopPropagation);
    });
  }

  static styles = [wordInfoBlockStyles, iconButtonStyle];

  _matchWordsArray() {
    return getAllMatchTextFromWordObj(this.wordObj);
  }

  // --------------------------------Heading---------------------------start
  _headingElement() {
    const wordDefault = this.wordObj?.word || this.newWord;

    const starRating = () => {
      if (this.mode !== 'lookUp') return;
      const starCount = this.wordObj?.stars;
      const outlineStar = StarOutlineIcon({ width: 15, height: 15 });
      const filledStar = StarIcon({ width: 15, height: 15 });

      const starButton = (targetNum) => {
        const filled = starCount >= targetNum;
        const handleUpdateRating = (targetNum) => {
          if (targetNum === starCount) return;
          chrome.runtime.sendMessage(
            {
              action: 'updateWordRating',
              rating: targetNum,
              wordId: this.wordObj.id,
            },
            (response) => {
              if (response.status === 'success') {
                this.wordObj = { ...this.wordObj, stars: targetNum };
              }
            }
          );
        };
        return html`<button
          type="button"
          class="rating-button"
          @click="${() => handleUpdateRating(targetNum)}"
        >
          ${filled ? filledStar : outlineStar}
        </button>`;
      };
      return html`<div>
        ${starButton(1)} ${starButton(2)} ${starButton(3)}
      </div>`;
    };

    const actionBar = () => {
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
        () => this._handleUpdateFormStatus('openMatchRule')
      );
      const searchLinkButton = html`
            <hooli-tooltip text='search this word in Google'>
            <a href=https://www.google.com/search?q=${
              this.newWord || this.wordObj.word
            } target="_blank" >       
            ${GlobeSearchIcon({ width: 15, height: 15 })}
            </hooli-tooltip>
            </a>`;

      const newContextButton = tooltipedButton(
        'add new context',
        BoxAddIcon({ width: 15, height: 15 }),
        () => (this.mode = 'newContext')
      );
      const editIcon = tooltipedButton(
        'edit this word',
        EditIcon({ width: 15, height: 15 }),
        () => (this.mode = 'editWord')
      );
      if (['editWord', 'newWord'].includes(this.mode))
        return html`${searchLinkButton} ${variantsAndMatchRuleButton}`;
      if (this.mode === 'newContext') return html`${searchLinkButton}`;

      if (this.mode === 'lookUp')
        return html` ${searchLinkButton} ${newContextButton}${editIcon}
          <hooli-menu>
            <li slot="list-item" @click="${() => (this.mode = 'deleting')}">
              ${DeleteIcon({ width: 15, height: 15 })} Delete
            </li>
          </hooli-menu>`;
    };

    const wordSection = () => {
      const displayingWord = html` <h3>${this.wordObj?.word}</h3>`;
      const deletingWord = html`<input type='checkbox'
     class='checkbox'
      name='delete-all' 
     id='heading-word-delete-checkbox' 
     @change="${this._handleCheckboxSelect}"></input>
     <label for='heading-word-delete-checkbox'>
     ${displayingWord}
     </label>`;

      if (this.mode === 'deleting') return deletingWord;
      const inputWord = html`<input 
                autocomplete="off"
                name='word'
                type='text'
                id='word-input' class='editable' 
                @input="${this._handleValidInput}"
                 @keypress="${this._handleEnterSubmit}"
                 .value="${wordDefault}"
                 ></input>`;

      if (['newWord', 'editWord'].includes(this.mode)) return inputWord;
      return displayingWord;
    };
    return html`
      <div id="heading-left">${wordSection()} ${starRating()}</div>
      <div id="action-bar">${actionBar()}</div>
    `;
  }
  // --------------------------------Heading---------------------------end
  // --------------------------------Definitions & Contexts---------------------------start

  _contextSection() {
    //---------definition and note: type: display / input / radio(choose one)--------------------
    const definitionSelectorTemplate = () => {
      //---------definition:annotation and note--------------------
      const definitionInput = (definitionObj) => {
        let definitionId = 'new';
        let note = '';
        let annotation = '';
        if (definitionObj) {
          definitionId = definitionObj.definitionId;
          note = definitionObj.note;
          annotation = definitionObj.annotation;
        }
        return html`
                    <div id=${
                      'definition-input-container-' + definitionId
                    } class='definition-input-container'>
                <hooli-tooltip text='show when hover the word' placement='bottom-end' offset='5'>
            <input 
            autocomplete="off"
            name='annotation'
            class='editable annotation-input' 
            placeholder='annotation'
            type="text" 
            id=${'annotation-input-' + definitionId}
            .value="${annotation}"
            @input="${this._handleValidInput}"
            @keypress="${this._handleEnterSubmit}"
            @change="${this._handleShortNote}">
            </input>
            </hooli-tooltip>
    
            <hooli-textarea 
            value=${note}
            class='editable long-note-textarea' 
            id=${'long-note-textarea-' + definitionId} 
            placeholder="note (optional)"
             @input="${this._handleValidInput}"
              @keypress="${this._handleEnterSubmit}">
              </hooli-textarea>
              </div>
            `;
      };

      const definitionSelectable = (definitionObj) => {
        const { definitionId } = definitionObj;
        const annotation = definitionObj.annotation;

        return html`<div class='definition-selectable' @click="${
          this._clickInsideRadio
        }">
                <input type='radio'  class='definition-selectable-radio'
                id=${'definition-selectable-' + definitionId}
                value=${definitionId}
                name='definition-select'>
                </input>
                <label for=${
                  'definition-selectable-' + definitionId
                }>${annotation}</label>
            </div>`;
      };

      if (this.mode === 'newWord') {
        return html`<div id="definition-selector">${definitionInput()}</div> `;
      }
      if (this.mode === 'editWord') {
        return html`<div id="definition-selector">
          ${this.wordObj.definitions.map((definitionObj, index) => {
            return html`<div>
              <div class="definition-index">${index + 1}</div>
              ${definitionInput(definitionObj)}
            </div>`;
          })}
        </div>`;
      }
      if (this.mode === 'newContext') {
        if (!this._formInputStatus.newDefinitionWhenDefinitionSelecting) {
          setTimeout(
            () =>
              (this.renderRoot.querySelector(
                '.definition-selectable-radio'
              ).checked = true)
          );
        }

        return html`<div id="definition-selector">
          <div id="selection-or-add">
            ${this.wordObj.definitions.map((definitionObj) => {
              return html`${definitionSelectable(definitionObj)}`;
            })}
            ${this._formInputStatus.newDefinitionWhenDefinitionSelecting
              ? html`${definitionInput()}
                  <button
                    type="button"
                    @click="${() => {
                      this._handleUpdateFormStatus(
                        'newDefinitionWhenDefinitionSelecting',
                        false
                      );
                      setTimeout(() => {
                        this.renderRoot
                          .querySelectorAll('.definition-selectable-radio')
                          .forEach((ele, index) => {
                            if (index === 0) ele.checked = true;
                            ele.disabled = false;
                          });
                      });
                    }}"
                  >
                    choose old one
                  </button> `
              : html`<button
                  type="button"
                  @click="${() => {
                    this._handleUpdateFormStatus(
                      'newDefinitionWhenDefinitionSelecting',
                      true
                    );
                    setTimeout(() => {
                      this.renderRoot
                        .querySelectorAll('.definition-selectable-radio')
                        .forEach((ele) => {
                          ele.checked = false;
                          ele.disabled = true;
                        });
                    });
                  }}"
                >
                  add new definition
                </button>`}
          </div>
        </div>`;
      }
      if (this.mode === 'editContext') {
        setTimeout(
          () =>
            (this.renderRoot.querySelector(
              '.definition-selectable-radio'
            ).checked = true)
        );
        return html`<div id="definition-selector">
          <div id="selection-or-add">
            ${this.wordObj.definitions.map((definitionObj) => {
              return html`${definitionSelectable(definitionObj)}`;
            })}
          </div>
        </div>`;
      }
    };

    const editableContext = (value) => {
      return html` <hooli-textarea
        id="context-textarea"
        placeholder="context/sentence"
        minlength="1"
        class="editable"
        value=${value}
        @keypress="${this._handleEnterSubmit}"
        @input="${this._handleValidInput}"
      ></hooli-textarea>`;
    };

    const matchRuleSelection = () => {
      const variantsInput = () => {
        return html`
           <input id='stem-input' name='stem' class='editable' type='text' placeholder='stem' autocomplete="off" .value="${
             this.wordObj?.stem || ''
           }"></input>
           <hooli-variants-input placeholder='variants' id='variants-input' .tags=${
             this.wordObj?.variants || []
           } ></hooli-variants-input>`;
      };

      if (this._formInputStatus.openMatchRule) {
        setTimeout(() => {
          this.renderRoot.querySelector(
            `#${this.wordObj?.matchRule || 'start'}`
          ).checked = true;
        });

        const radioButtonWithToolTip = (value) => {
          return html`<hooli-tooltip>
            <hooli-highlighter  
            slot='tooltip-content'
            text="the @reallycoolguy in cooler is not supercool but that's cool"
             matchword='cool'
             matchrule=${value}
             ></hooli-highlighter>
            <input type='radio' name='match-rule' id=${value} value=${value}></input>
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
              ${radioButtonWithToolTip('start')}
              ${radioButtonWithToolTip('end')}
              ${radioButtonWithToolTip('independent')}
              ${radioButtonWithToolTip('any')}
            </div>
            <div>${variantsInput()}</div>
          </div>
        `;
      }
    };

    const contextDate = (date) => {
      return html`<span class="date"
        >${dayjs(date).isSame(dayjs(), 'year')
          ? dayjs(date).format('MMM D')
          : dayjs(date).format('MMM D,YY')}</span
      > `;
    };
    const pageTitle = (faviconSrc, url, pageTitle, contextId) => {
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
        ${contextId
          ? html`<hooli-menu>
              <span slot="button-text-or-icon"
                >${EditInLightIcon({ width: 13, height: 13 })}</span
              >
              <li
                slot="list-item"
                @click="${() => this._handlePhraseSelect(contextId)}"
              >
                ${AnchorSelectIcon({ width: 13, height: 13 })} highlight context
              </li>
              <li
                slot="list-item"
                @click="${() => this._handleContextEdit(contextId)}"
              >
                ${EditIcon({ width: 13, height: 13 })} edit context
              </li>
            </hooli-menu>`
          : null}
      </div>`;
    };

    const definitionTags = (tags, definitionId, inputMode) => {
      const allTagLabels = tagList.map((tagObj) => tagObj.tag);
      const selectedTagLabels = tags.map(
        (tagId) => tagList.find((tagObj) => tagObj.id === tagId).tag
      );

      const tagsBox = () => {
        const openTagsInput = (e) => {
          e.preventDefault();
          this._editingTags = definitionId;
        };

        return html` <div class="tags-button-container">
          <div id="tags-${definitionId}">
            ${selectedTagLabels.map((tagLabel) => {
              return html`<hooli-tag taglabel=${tagLabel}></hooli-tag>`;
            })}
          </div>
          <button class="icon-button" @click=${openTagsInput}>
            ${LabelsIcon({ width: 15, height: '15' })}
          </button>
        </div>`;
      };
      const tagsInput = () => {
        return html`<hooli-selectable-tags-input
          .options=${allTagLabels}
          .selectedoptions=${selectedTagLabels}
          @submittags=${(e) => console.log(e)}
          @cancelediting=${(e) => console.log(e)}
          id="tags-input-${definitionId}"
        >
        </hooli-selectable-tags-input>`;
      };

      if (inputMode) return html`${tagsInput()}`;
      return html`${tagsBox()}`;
    };

    if (['newWord'].includes(this.mode)) {
      return html`
        ${matchRuleSelection()} ${definitionSelectorTemplate()}
        ${editableContext(this.contextHere)}
        ${pageTitle(this._currentSiteIcoSrc, currentURL(), document.title)}
      `;
    }
    if (this.mode === 'newContext') {
      return html`${definitionSelectorTemplate()}
      ${editableContext(this.contextHere)}
      ${pageTitle(this._currentSiteIcoSrc, currentURL(), document.title)} `;
    }
    if (this.mode === 'editWord') {
      return html` ${matchRuleSelection()} ${definitionSelectorTemplate()} `;
    }
    if (this.mode === 'editContext' && this._workingContext) {
      const contextId = this._workingContext;
      const contextObj = this.contexts.find(
        (contextObj) => contextObj.id === contextId
      );

      return html`
        ${definitionSelectorTemplate()} ${editableContext(contextObj.context)}
      `;
    }
    if (this.mode === 'highlighting' && this._workingContext) {
      const selectedText = this._phraseSelection;
      const contextId = this._workingContext;
      const contextObj = this.contexts.find(
        (contextObj) => contextObj.id === contextId
      );

      return html` <div class="definition-and-contexts-container">
        <div class="outer-context-container">
          <div class="vertical-line"></div>
          <div class="inner-context-container">
            <h5 class="phrase">${selectedText}</h5>
            <p id="p-${contextObj.id}" class="highlighting">
              <hooli-highlighter
                text=${contextObj.context}
                matchword=${selectedText}
              >
              </hooli-highlighter>
              ${contextDate(contextObj.date)}
            </p>
          </div>
        </div>
      </div>`;
    }

    if ((this.mode === 'lookUp' && this.contexts) || this.mode === 'deleting') {
      return html` ${this.wordObj.definitions.map((definition, i) => {
        return html` <div class="definition-and-contexts-container">
          <h6 class="annotation">${definition.annotation}</h6>
          ${this.mode === 'deleting'
            ? null
            : definitionTags(
                definition.tags,
                definition.definitionId,
                this._editingTags === definition.definitionId
              )}
          <p class="definition-note">${definition.note}</p>
          ${this.contexts
            .filter(
              (contextObj) =>
                contextObj.definitionRef === definition.definitionId
            )
            .map((contextObj, index) => {
              let matchedWord;
              matchedWord =
                contextObj.phrase ||
                this._matchWordsArray().find((string) => {
                  const regex = new RegExp(string, 'gi');
                  return regex.test(contextObj.context);
                });

              let src;
              if (this.imgSrcs.length > 0) {
                src = this.imgSrcs.find((domainObj) => {
                  return domainObj.url === new URL(contextObj.url).hostname;
                })?.icon;
              }
              return html`
                <div class="outer-context-container">
                  <div class="vertical-line"></div>
                  <div class="inner-context-container">
                    ${this.mode === 'deleting' && this.contexts.length > 1
                      ? html`<input type='checkbox' class='checkbox context-delete-checkbox' name=${contextObj.id} id='c-${contextObj.id}' @change="${this._handleCheckboxSelect}"></input>`
                      : null}
                    <h5 class="phrase">${contextObj.phrase}</h5>
                    <p id="p-${contextObj.id}">
                      <hooli-highlighter
                        text=${contextObj.context}
                        matchword=${matchedWord}
                      >
                      </hooli-highlighter>
                      ${contextDate(contextObj.date)}
                    </p>
                  </div>
                  ${pageTitle(
                    src,
                    contextObj.url,
                    contextObj.pageTitle,
                    contextObj.id
                  )}
                </div>
              `;
            })}
        </div>`;
      })}`;
    }
  }

  // --------------------------------Definitions & Contexts---------------------------end

  _submitSection() {
    const submitButtonTexts = {
      newContext: 'Add',
      editWord: 'Edit',
      editContext: 'Edit',
      newWord: 'Save',
      deleting: 'Delete',
      highlighting: 'Highlight',
    };
    const getSubmitButtonText = () => {
      return submitButtonTexts[this.mode] + '⏎';
    };

    if (Object.keys(submitButtonTexts).includes(this.mode))
      return html`
        <div id="submit-helper-text">${this._helperText}</div>
        <button type="button" @click="${this._handleCancel}" id="cancel-button">
          Cancel
        </button>
        <button
          type="submit"
          @click="${this._handleFormSubmit}"
          id="submit-button"
        >
          ${getSubmitButtonText()}
        </button>
      `;
  }

  render() {
    return html`<div id="container">
      <form>
        <div id="heading-container">${this._headingElement()}</div>
        <div id="context-section">${this._contextSection()}</div>
        <div id="submit-section">${this._submitSection()}</div>
      </form>
    </div>`;
  }

  //   _helperText() {
  //     if (this.mode === 'deleting') {
  //       const selectAll = this.renderRoot.querySelector(
  //         '#heading-word-delete-checkbox'
  //       )?.checked;

  //       if (this.contexts.length > 1) {
  //         const checkboxes = this.renderRoot.querySelectorAll(
  //           '.context-delete-checkbox'
  //         );
  //         let selectedContexts = 0;
  //         checkboxes.forEach((checkbox) => {
  //           if (!checkbox.checked) return;
  //           selectedContexts++;
  //           return;
  //         });
  //         if (selectAll === true)
  //           return `delete this word and all ${selectedContexts} of its contexts?`;
  //         if (selectedContexts > 0)
  //           return `delete ${selectedContexts} of its contexts?`;
  //         return `check the context or the whole word to delete`;
  //       }

  //       if (selectAll === true) return `delete this word and its context?`;
  //       return `check to delete the word and its context`;
  //     }
  //   }

  _clickInsideRadio(e) {
    if (e.target.classList.contains('definition-selectable')) {
      const targetRadio = e.target.querySelector('input');
      targetRadio.click();
    }
  }

  _handleCheckboxSelect(e) {
    const mainCheckEle = this.renderRoot.querySelector(
      '#heading-word-delete-checkbox'
    );
    const allContextCheckEles = this.renderRoot.querySelectorAll(
      '.context-delete-checkbox'
    );
    if (this.contexts.length > 1) {
      if (e.target === mainCheckEle) {
        allContextCheckEles.forEach((checkbox) => {
          checkbox.checked = e.target.checked;
        });
        this.requestUpdate();
        return;
      }
      if (e.target.checked === false) mainCheckEle.checked = false;
      if (e.target.checked === true) {
        let allTrue = true;
        allContextCheckEles.forEach((contextCheckEle) => {
          if (!contextCheckEle.checked) allTrue = false;
        });
        if (allTrue) mainCheckEle.checked = true;
      }
    }
    // this.requestUpdate();
  }

  _handleValidInput(e) {
    let content = e.target.value;
    if (content && content.trim()) {
      e.target.classList.add('editable-valid');
      return;
    } else {
      if (e.target.classList.contains('editable-valid'))
        e.target.classList.remove('editable-valid');
      return;
    }
  }

  // _handleEleValidInput(ele) {
  //     const checkMark = document.createElement('span')
  //     checkMark.classList.add('icon', 'validCheckmark')
  //     checkMark.textContent = 'test123'

  //     if (ele.value || ele.textContent) {
  //         if (!ele.classList.contains('editable-valid')) {
  //             ele.classList.add('editable-valid')
  //             ele.appendChild(checkMark.cloneNode())
  //         }
  //     } else {
  //         if (ele.classList.contains('editable-valid')) {
  //             ele.classList.remove('editable-valid')
  //             ele.removeChild(ele.querySelector('.validCheckmark'))
  //         }
  //     }
  // }

  // _handleSwitchMode(mode) {
  //     this.mode = mode
  // }

  _handleCancel() {
    if (this.mode === 'newWord') {
      this.remove();
      return;
    }
    if (this.mode === 'highlighting') {
      this._phraseSelection = '';
      this._handlePhraseSelect(this._workingContext, false);
      this._workingContext = null;
    }
    this.mode = 'lookUp';
  }

  _formValidation(targetNames, targetValues, options) {
    if (options) {
      if (options.includes('newWord')) {
        if (myList.find((wordObj) => wordObj.word === targetValues.word)) {
          this._helperText = 'this word already exist';
          return false;
        }
      }
      if (options.includes('delete')) {
        if (targetValues['allCheckedName'].length === 0) {
          this._helperText = 'please fill the checkbox';
          return false;
        } else {
          return true;
        }
      }
      if (options.includes('selectedDefinitionIdOrAnnotation')) {
        if (
          !targetValues['selectedDefinitionId'] &&
          !targetValues['annotation']
        ) {
          this._helperText =
            'please check one of the definition or add new one';
          return false;
        }
      }
    }
    const lackedValueNames = [];
    targetNames.forEach((targetName) => {
      if (!targetValues[targetName]) lackedValueNames.push(targetName);
    });

    if (lackedValueNames.length > 0) {
      this._helperText = `Please fill ${lackedValueNames.join(',')}.`;
      return false;
    }
    return true;
  }
  _handleFormSubmit(e) {
    e.preventDefault();
    if (this.mode === 'highlighting') {
      const phrase = this._phraseSelection;
      const contextId = this._workingContext;

      submitAndExecute(
        {
          action: 'changePhraseToContext',
          phrase,
          contextId,
        },
        () => {
          this.contexts = this.contexts.map((contextObj) => {
            if (contextObj.id === this._workingContext) {
              contextObj.phrase = this._phraseSelection;
            }
            return contextObj;
          });
          this._handlePhraseSelect(contextId, false);
          this._phraseSelection = null;
          this._workingContext = null;
          this.mode = 'lookUp';
        }
      );
      return;
    }

    const formData = new FormData(this.renderRoot.querySelector('form'));
    const formObj = Object.fromEntries(formData.entries());
    console.log(Object.fromEntries(formData.entries()));

    if (this.mode === 'deleting') {
      console.log('delete!');

      const allCheckedName = Object.keys(formObj);

      if (!this._formValidation(null, { allCheckedName }, ['delete'])) return;

      if (allCheckedName.includes('delete-all')) {
        const wordId = this.wordObj.id;
        submitAndExecute(
          {
            action: 'deleteThisWordObjAndAllItsContexts',
            wordId,
            contextIdsToDelete: this.contexts.map((context) => context.id),
          },
          () => {
            this.remove();
            restoreHolliText(wordId);
          }
        );
        return;
      }

      const contextIdsToDelete = allCheckedName.map((contextId) => +contextId);
      const allDefinitionRefs = {};
      if (contextIdsToDelete.length > 0) {
        this.contexts.forEach((contextObj) => {
          allDefinitionRefs[contextObj.definitionRef]
            ? allDefinitionRefs[contextObj.definitionRef]++
            : (allDefinitionRefs[contextObj.definitionRef] = 1);
          if (contextIdsToDelete.includes(contextObj.id)) {
            allDefinitionRefs[contextObj.definitionRef]--;
          }
        });
        const definitionsToDelete = [];
        Object.entries(allDefinitionRefs).forEach((keyPair) => {
          if (keyPair[1] === 0) definitionsToDelete.push(keyPair[0]);
        });
        console.log(contextIdsToDelete, definitionsToDelete);

        const request = { contextIdsToDelete };
        if (definitionsToDelete.length > 0) {
          request.newDefinitions = this.wordObj.definitions.filter(
            (definition) => {
              return !definitionsToDelete.includes(definition.definitionId);
            }
          );
          request.action = 'deleteContextsAndDefinitions';
          request.wordId = this.wordObj.id;
        } else {
          request.action = 'deleteContexts';
        }
        submitAndExecute(request, () => {
          this.contexts = this.contexts.filter(
            (contextObj) => !contextIdsToDelete.includes(contextObj.id)
          );
          if (request.action === 'deleteContextsAndDefinitions') {
            this.wordObj = {
              ...this.wordObj,
              definitions: request.newDefinitions,
            };
            setTimeout(() => updateWordObjToElementsAndWordList(this.wordObj));
          }
          this.mode = 'lookUp';
        });
        return;
      }
    }

    const word = formObj.word?.trim();
    const annotation = formObj.annotation?.trim();
    const stem = formObj.stem?.trim();
    const matchRule = formObj['match-rule'];
    const selectedDefinitionId = formObj['definition-select'];
    const context = this.renderRoot
      .querySelector('#context-textarea')
      ?.value.trim();
    const wordNote = this.renderRoot
      .querySelector('.long-note-textarea')
      ?.value.trim();
    const variants = this.renderRoot.querySelector('#variants-input')?.tags;
    console.log({
      word,
      annotation,
      stem,
      matchRule,
      selectedDefinitionId,
      context,
      wordNote,
      variants,
    });
    // return

    if (this.mode === 'newWord') {
      //   console.log({matchRule, word, stem, variants, annotation, wordNote, context });

      if (
        !this._formValidation(['word', 'annotation', 'context'], {
          word,
          annotation,
          context,
        })
      )
        return;

      const theNewWord = {
        id: nanoid(),
        word,
        associationWOrdIds: [],
        definitionCount: 1,
        definitions: [
          {
            annotation,
            definitionId: '0',
            note: wordNote,
            tags: [],
          },
        ],
        matchRule: matchRule || '',
        stem: stem || '',
        variants: variants || [],
      };

      console.log(theNewWord);

      const theNewContext = {
        context,
        word,
        wordId: theNewWord.id,
        date: Date.now(),
        definitionRef: '0',
        note: '',
        pageTitle: document.title,
        phrase: '',
        url: currentURL(),
      };

      submitAndExecute(
        {
          action: 'saveWordAndContext',
          newWord: theNewWord,
          newContext: theNewContext,
        },
        () => {
          myList.push(theNewWord);
          newList.push(...getMatchTextWithIdRef(theNewWord));
          renderRuby(document.body, true);
          this.remove();
        },
        (response) => {
          if (response.status === 'existWord') {
            this._helperText = 'this word is already exist';
          }
        }
      );
    }

    if (this.mode === 'newContext') {
      if (
        !this._formValidation(
          ['context'],
          { context, selectedDefinitionId, annotation },
          ['selectedDefinitionIdOrAnnotation']
        )
      )
        return;

      const definitionRef = selectedDefinitionId
        ? selectedDefinitionId
        : `${this.wordObj.definitionCount || 1}`;
      let newDefinition = null;
      if (!selectedDefinitionId && annotation) {
        newDefinition = {
          annotation,
          definitionId: definitionRef,
          note: wordNote,
          tags: [],
        };
      }

      const newContext = {
        context,
        word: this.wordObj.word,
        wordId: this.wordObj.id,
        date: Date.now(),
        definitionRef,
        note: '',
        pageTitle: document.title,
        phrase: '',
        url: currentURL(),
      };
      console.log(newContext);
      console.log(newDefinition ? newDefinition : 'no new definition');

      const request = {};
      request.action = 'addNewContextForSavedWord';
      request.newContext = newContext;
      if (newDefinition) {
        request.action = 'addNewContextAndDefinitionForSavedWord';
        request.updatedDefinitions = [
          ...this.wordObj.definitions,
          newDefinition,
        ];
        request.definitionCount = +definitionRef + 1;
      }

      submitAndExecute(request, (response) => {
        if (newDefinition) {
          this.wordObj = {
            ...this.wordObj,
            definitionCount: request.definitionCount,
            definitions: [...this.wordObj.definitions, newDefinition],
          };
          setTimeout(() => {
            updateWordObjToElementsAndWordList(this.wordObj);
          });
        }
        this._getContextsFromDB();
        this.mode = 'lookUp';
      });
    }
    if (this.mode === 'editWord') {
      if (!this._formValidation(['word'], { word })) return;
      const defintionEles = this.renderRoot.querySelectorAll(
        '.definition-input-container'
      );

      const definitions = [];
      defintionEles.forEach((ele) => {
        const splittedEleId = ele.id.split('-');
        const definitionId = splittedEleId[splittedEleId.length - 1];
        const annotation = ele.querySelector('.annotation-input').value.trim();
        const note = ele.querySelector('.long-note-textarea').value.trim();
        definitions.push({
          definitionId,
          annotation,
          note,
          tags: [],
        });
      });

      console.log(definitions, stem, variants, matchRule);

      submitAndExecute(
        {
          action: 'editWord',
          wordId: this.wordObj.id,
          word,
          definitions,
          stem,
          variants,
          matchRule,
        },
        () => {
          this.wordObj = {
            ...this.wordObj,
            word,
            definitions,
            stem,
            variants,
            matchRule,
          };
          this.mode = 'lookUp';
          updateWordObjToElementsAndWordList(this.wordObj);
          //todo: if new update match list
        }
      );
    }
    if (this.mode === 'editContext') {
      if (
        !this._formValidation(['context', 'selectedDefinitionId'], {
          context,
          selectedDefinitionId,
        })
      )
        return;
      const contextId = this._workingContext;
      submitAndExecute(
        {
          action: 'editContext',
          context,
          contextId,
          definitionRef: selectedDefinitionId,
        },
        () => {
          this.mode = 'lookUp';
          this._workingContext = null;
          this._getContextsFromDB();
        }
      );
    }
  }

  _handleUpdateFormStatus(targetStatus, value) {
    this._formInputStatus = {
      ...this._formInputStatus,
      [targetStatus]:
        typeof value === 'undefined'
          ? !this._formInputStatus[targetStatus]
          : value,
    };
  }

  _handleEnterSubmit(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.renderRoot.querySelector('#submit-button').click();
    }
  }

  _handleContextEdit(contextId) {
    this.mode = 'editContext';
    this._workingContext = contextId;
  }

  _handlePhraseSelect(contextId, state) {
    const thisShadowRoot = document.querySelector(
      'hooli-wordinfo-block'
    ).shadowRoot;
    const targetContextObj = this.contexts.find(
      (contextObj) => contextObj.id === contextId
    );
    const targetContext = targetContextObj.context;

    const getSelectText = () => {
      const selection = thisShadowRoot.getSelection();
      const selectedText = selection.toString().trim();
      if (selectedText.length === 0) return;
      if (targetContext.includes(selectedText)) {
        const matched = this._matchWordsArray().find((variant) => {
          const regex = new RegExp(variant, 'i');
          return regex.test(targetContext);
        });
        if (matched) {
          const regex = new RegExp(matched, 'i');
          if (!regex.test(selectedText)) return;
          this._phraseSelection = selectedText;
        }
      }
    };
    if (state === false) {
      this._phraseSelection = '';
      this._workingContext = null;
      thisShadowRoot.removeEventListener('mouseup', getSelectText);
      return;
    }
    this._phraseSelection = targetContextObj.phrase || this.wordObj.word;
    thisShadowRoot.addEventListener('mouseup', getSelectText);
    // targetContextEle.classList.add('highlighting')
    this.mode = 'highlighting';
    this._workingContext = contextId;
  }

  _handleClose(e) {
    if (
      !e.composedPath().some((node) => node.tagName === 'HOOLI-WORDINFO-BLOCK')
    ) {
      document.querySelector('hooli-wordinfo-block').remove();
    }
  }
  _stopPropagation(e) {
    e.stopPropagation();
  }

  _pronSearch = async (language) => {
    const pronounceDataResult = await fetchPronInfo(
      this.newWord,
      this.contextHere
    );
    if (pronounceDataResult) {
      const annotationInput =
        this.renderRoot.querySelector('.annotation-input');
      const originalAnnotation = annotationInput.value;
      annotationInput.value = pronounceDataResult + ' ' + originalAnnotation;
      // this._handleEleValidInput(annotationInput)
    }
  };
  _getContextsFromDB() {
    chrome.runtime.sendMessage(
      { action: 'getContexts', wordId: this.wordObj.id },
      (response) => {
        // console.log(response.contexts)
        this.contexts = response.contexts;
        const allDomains = response.contexts.map((contextObj) => {
          return new URL(contextObj.url).hostname;
        });
        chrome.runtime.sendMessage(
          {
            action: 'getImgDataFromUrls',
            domains: allDomains,
          },
          (response) => {
            this.imgSrcs = response.domainData;
          }
        );
      }
    );
  }
  _updateModeAndDoSth(mode) {
    //todo: this one right now is not really updating any mode, just handle the focus.
    if (mode) this.mode = mode;

    // if (this.mode === 'newWord') {
    //   setTimeout(() => {
    //     const annoInput = this.renderRoot
    //       .querySelector('.annotation-input')
    //       .focus();
    //   });
    // }
  }
  firstUpdated() {
    const getFaviconThisSite = () => {
      chrome.runtime.sendMessage({ action: 'getFaviconThisSite' }, (res) => {
        this._currentSiteIcoSrc = res.iconUrl;
      });
    };
    window.addEventListener('mouseup', this._handleClose);
    if (this.mode === 'lookUp') {
      this._getContextsFromDB();
    }
    if (this.mode === 'newWord') {
      this._pronSearch();
      getFaviconThisSite();
    }
    if (this.mode === 'newContext') {
      getFaviconThisSite();
    }
    //   this.renderRoot.querySelector('.annotation-input').focus();

    if (this.wordObj) {
      if (
        this.wordObj.stem ||
        this.wordObj.matchRule ||
        this.wordObj.variants?.length > 0
      ) {
        this._formInputStatus.openMatchRule = true;
      }
    }
    // this.renderRoot.querySelectorAll('.editable').forEach(ele => {
    //     this._handleEleValidInput(ele)
    // })
    this._updateModeAndDoSth();
  }
  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mouseup', this._handleClose);
  }
}

customElements.define('hooli-wordinfo-block', HooliWordInfoBlock);
