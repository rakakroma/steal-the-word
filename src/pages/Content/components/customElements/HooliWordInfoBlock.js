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
} from '@spectrum-web-components/icons-workflow';
// import { CheckmarkIcon } from '@spectrum-web-components/icons-workflow/src/icons.js';

import { LitElement, html, css } from 'lit';
import dayjs from 'dayjs';
// import { getSentenceFromSelection } from '../../utils/get-selection-more.ts'
import { nanoid } from 'nanoid';
import { myList, restoreHolliText } from '../../index';
import { renderRuby } from '../../utils/renderRuby';
import { fetchPronInfo } from '../../utils/fetchPronInfo';
import './HolliToolTip';
import './HooliSpinner';



// input.editable-valid:after{
//     content: url("data:image/svg+xml,%3Csvg height='15px' viewBox='0 0 18 18' width='15px' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E .fill %7B fill: %23464646; %7D %3C/style%3E%3C/defs%3E%3Ctitle%3ES Checkmark 18 N%3C/title%3E%3Crect id='Canvas' fill='%23ff13dc' opacity='0' width='18' height='18'/%3E%3Cpath class='fill' d='M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z' style='fill: rgb(98, 222, 170);'/%3E%3C/svg%3E");
//     position: absolute;
//     bottom: 4px;
//     right: -17px;
// }

// hooli-textarea.editable-valid:after{
//     content: url("data:image/svg+xml,%3Csvg height='15px' viewBox='0 0 18 18' width='15px' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E .fill %7B fill: %23464646; %7D %3C/style%3E%3C/defs%3E%3Ctitle%3ES Checkmark 18 N%3C/title%3E%3Crect id='Canvas' fill='%23ff13dc' opacity='0' width='18' height='18'/%3E%3Cpath class='fill' d='M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z' style='fill: rgb(98, 222, 170);'/%3E%3C/svg%3E");
//     position: absolute;
//     bottom: 1px;
//     right: 10px;
// }
const currentURL = window.location.hash
  ? window.location.href.slice(
      0,
      window.location.href.lastIndexOf(window.location.hash)
    )
  : window.location.href;

const updateWordObjToElementsAndWordList = (wordObj)=>{
    const updatedWordObj = {...wordObj}
    const wordToUpgradeIndex = myList.findIndex(wordObj=>wordObj.id===updatedWordObj.id)
    myList[wordToUpgradeIndex] = {...updatedWordObj}
    document.querySelectorAll(`h-${updatedWordObj.id}`).forEach(ele=>{
        ele.wordObj = {...updatedWordObj}
     })
}

const sendToBackground = (info)=>{
    chrome.runtime.sendMessage(info,(res)=>{
        console.log(res)
        if(res.status==='success'){
            return res
        }
    })
}

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
      _loading: { state: true },
      _workingContext: { state: true },
      _helperText:{state:true}
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
    this._loading = false;
    this._workingContext = null;
    this._helperText = '';
    ['keydown', 'keyup', 'keypress'].forEach((event) => {
      this.addEventListener(event, this._stopPropagation);
    });
  }

  static styles = [
    css`:host{
            font-size:12px;
            z-index:99999999;
            position:absolute;
            transform: translateX(-50%);
        }
        *{
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

        }

        #container{
            --block-background-color: white;
            --block-text-color:black;
            background-color:var(--block-background-color);
            color:var(--block-text-color);
            text-align:initial;
            width:390px;
            max-height:400px;
            overflow-y:overlay;
            display:flex;
            flex-direction:column;
            border:1px solid black;
            box-shadow: 3.0px 6.1px 6.1px hsl(0deg 0% 0% / 0.41);
            border-radius: 5px;
            white-space:normal;
            line-height:18px;
        }
        #container::-webkit-scrollbar {
  display: none;
}

        h3{
            font-size:16px;
            max-width:260px;
        }
        h3,h5,h6{
            display:inline-block;
            margin:0;
        }
        h5{
            font-size:13px;
        }
        p{
            font-size:12px;
            margin:0;
        }
        .context-link{
            color:grey;
            margin-right:6px;
            display:inline-block;
            height:16px;
            width:16px;
        }
        a{
            text-decoration:none;
        }
        .page-title{
            width:90%
            height:21px;
            display: flex;
            padding-left: 5px;
            align-items: center;
        }
        .page-title h6{
            margin-left:5px;
            font-size:12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width:287px;
        }
       img{
            width:15px;
            height:15px;
        }
        .date{
            color:grey;
            width:fit-content;
            margin-left:4px;
        }
  
        .icon-button{
            color:grey;
            border:0;
            background:transparent;
            cursor:pointer;
        }
        .icon{
            color:#00a282;
        }
        .new-definition-button:hover{
            background-color:#d2d2d2;
        }
        #definition-selector{
            padding-bottom:6px;
        }
        .edit-instruction-text{
            color:#11483d;
        }
        .all-input-container{
            display:flex;
        }
        input[type=text]{
            width:100%;
            background-color:var(--block-background-color);
            color:var(--block-text-color);
            border:none;
            outline:none;
        }
        .divider{
            border: 0;
            display:block;
            width: 98%;               
            background-color:var(--block-text-color);
            height: 1px;
            margin:0;
        }
        #heading-container{
            position:relative;
            display:flex;
            justify-content:space-between;   
            padding:4px;
        }
        #heading-left{
            width:65%;
        }
        #submit-section{
            display:flex;
            justify-content:flex-end;
        }
        #submit-section > button{
            min-width: fit-content;
            background-color:var(--block-background-color);
            border: 1px solid #b8b8b8;
            padding: 6px;
            border-radius: 10px;
            cursor: pointer;
            margin: 3px;   
            font-size:13px;     
            }

        #submit-button{
            color: rgb(89, 137, 138);
            }

        #submit-button:hover,  #submit-button:focus{
        background-color:#e9faf6;
        }

        #cancel-button{
            color:#797979
        }
        #cancel-button:hover,  #cancel-button:focus{
        background-color:#dedddd;
        color:black;
        }


        .editable{
            background:#efeeee;
            border-radius:4px;
            position:relative;

        }
        .editable:focus,.editable:focus-within{
            outline:2px solid #cecdcd;
            background:white;
        }
        .editable:hover{
            outline:3px solid #d2d2d2;
            background:white;
        }
        .editable.editable-valid{
            background:white;
         }

        .editable.editable-valid:focus{
            outline:2px solid #7bffc8;
            color:var(--block-text-color);
        }

        .validCheckmark{
            position:absolute;
            display: inline-block;
            bottom:5px;
            right:-30px;
        }
        #action-bar{
            width:35%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            position:absolute;
            right:6px;
            top:6px;
        }

        #context-textarea{
            outline:1px solid grey;
        }
        .definition-and-contexts-container{
            margin-left:8px;
            margin-right:8px;
            margin-bottom:5px;
        }

        .outer-context-container{
            position:relative;
            margin-left:9px;
            margin-right:14px;
            margin-bottom:3px;
        }
        .inner-context-container{
            display:flex;
            flex-direction:column;
            margin-top:3px;
            margin-bottom:1px;
        }
        .vertical-line{
            position:absolute;
            left:-7px;
            border-left: 2px solid rgb(128 128 128 / 13%);
            height:103%;
        }
        .count-context-num{
            font-size:14px;
            margin-right:10px;
        }
        .context-delete-checkbox{
            width:15px;
            height:15px;
        }
        select{
            background-color:var(--block-background-color);
            color:var(--block-text-color)
        }
        .annotation-input{
            border:none;
            margin-bottom:5px;
            padding-left:5px;
        }
        #word-input{
            font-size: 16px;
            border: none;
            font-weight: 700;
        }
        .highlighting{
            font-size:13px;
            cursor: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='12px' height='12px' viewBox='0 0 12 12' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 5.445312 5.9375 C 5.074219 5.894531 4.699219 5.996094 4.398438 6.21875 C 4.0625 6.519531 3.835938 6.921875 3.742188 7.363281 C 3.652344 7.839844 3.394531 8.269531 3.015625 8.570312 C 2.941406 8.605469 2.875 8.652344 2.816406 8.707031 C 2.761719 8.765625 2.75 8.859375 2.796875 8.925781 C 2.835938 8.960938 2.882812 8.984375 2.929688 8.992188 C 4.035156 9.246094 5.449219 9.328125 6.355469 8.511719 C 6.730469 8.175781 6.902344 7.667969 6.816406 7.171875 C 6.730469 6.679688 6.394531 6.261719 5.929688 6.070312 C 5.777344 6 5.613281 5.957031 5.445312 5.9375 Z M 5.445312 5.9375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 7.644531 6.507812 C 9.546875 4.34375 11.964844 1.371094 11.332031 0.738281 C 10.699219 0.105469 8.078125 3.058594 6.195312 5.125 C 6.839844 5.375 7.363281 5.875 7.644531 6.507812 Z M 7.644531 6.507812 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 2.488281 1.984375 L 2.289062 1.304688 C 1.742188 1.679688 1.304688 2.195312 1.019531 2.796875 L 1.683594 2.957031 C 1.878906 2.578125 2.15625 2.25 2.488281 1.984375 Z M 2.488281 1.984375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 4.332031 C 1.332031 4.253906 1.351562 4.175781 1.355469 4.097656 L 0.695312 3.9375 C 0.675781 4.082031 0.667969 4.226562 0.667969 4.371094 L 0.667969 5.40625 L 1.332031 5.40625 Z M 1.332031 4.332031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 7.667969 L 1.332031 6.59375 L 0.667969 6.59375 L 0.667969 7.628906 C 0.667969 7.796875 0.679688 7.960938 0.703125 8.125 L 1.363281 7.964844 C 1.347656 7.863281 1.339844 7.765625 1.332031 7.667969 Z M 1.332031 7.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.714844 9.097656 L 1.046875 9.257812 C 1.332031 9.835938 1.757812 10.332031 2.289062 10.691406 L 2.492188 10.011719 C 2.171875 9.765625 1.90625 9.453125 1.714844 9.097656 Z M 1.714844 9.097656 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 10.667969 C 4.074219 10.664062 3.816406 10.625 3.566406 10.554688 L 3.378906 11.195312 C 4.027344 11.378906 4.714844 11.378906 5.363281 11.195312 L 5.167969 10.535156 C 4.898438 10.617188 4.617188 10.664062 4.332031 10.667969 Z M 4.332031 10.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.960938 9.082031 C 6.78125 9.421875 6.53125 9.722656 6.238281 9.964844 L 6.449219 10.695312 C 6.980469 10.332031 7.410156 9.839844 7.691406 9.261719 Z M 6.960938 9.082031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.980469 2.953125 C 7.160156 2.757812 7.332031 2.574219 7.5 2.398438 C 7.226562 1.964844 6.871094 1.59375 6.449219 1.304688 L 6.238281 2.035156 C 6.542969 2.285156 6.796875 2.597656 6.980469 2.953125 Z M 6.980469 2.953125 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 1.332031 C 4.617188 1.335938 4.898438 1.382812 5.167969 1.464844 L 5.359375 0.804688 C 4.710938 0.621094 4.027344 0.621094 3.378906 0.804688 L 3.566406 1.445312 C 3.816406 1.375 4.074219 1.335938 4.332031 1.332031 Z M 4.332031 1.332031 '/%3E%3C/g%3E%3C/svg%3E%0A"), auto;
        }
        .definition-selectable{
            display: flex;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 8px;
            margin:3px;
        }
        #selection-or-add{
            padding:5px;
        }
        label{
            width:-webkit-fill-available;
        }
        .definition-index{
     margin-left: 8px;
    padding: 0 5px 0 5px;
    color: white;
    background-color: rgb(106, 159, 105);
    border-radius: 5px;
    font-size: 14px;
    display: block;
    width: fit-content;    }
        `,
  ];

_matchWordsArray() {
    const matchTextFromWordObj = [this.wordObj.word];
    if (this.wordObj.stem) matchTextFromWordObj.push(this.wordObj.stem);
    if (this.wordObj.variants?.length > 0)
      this.wordObj.variants.forEach((variant) => {
        matchTextFromWordObj.push(variant);
      });
    matchTextFromWordObj.sort((a, b) => b.length - a.length);
    return matchTextFromWordObj;
  }

  _headingElement() {
    const wordDefault = this.wordObj?.word || this.newWord;

    const actionBar = () => {
      const variantsAndMatchRuleButton = () => {
        return html`
          <hooli-tooltip text="add match rule">
            <button
              class="icon-button"
              id="add-match-rule"
              @click="${() => this._handleUpdateFormStatus('openMatchRule')}"
            >
              ${FindAndReplaceIcon({ width: 15, height: 15 })}
            </button>
          </hooli-tooltip>
        `;
      };
      const searchLinkButton = () => html`
            <hooli-tooltip text='search this word in Google'>
            <a href=https://www.google.com/search?q=${
              this.newWord || this.wordObj.word
            } target="_blank" >       
            ${GlobeSearchIcon({ width: 15, height: 15 })}
            </hooli-tooltip>
            </a>`;

      if (['editWord', 'newWord'].includes(this.mode))
        return html` <div id="action-bar">
          ${searchLinkButton()} ${variantsAndMatchRuleButton()}
        </div>`;
      if (this.mode === 'newContext')
        return html`<div id="action-bar">${searchLinkButton()}</div>`;

      if (this.mode === 'lookUp')
        return html` <div id="action-bar">
          <hooli-tooltip text="search this word in Google">
            ${searchLinkButton()}
          </hooli-tooltip>
          <hooli-tooltip text="add new context">
            <button
              class="icon-button"
              id="add-new-context"
              @click="${() => (this.mode = 'newContext')}"
            >
              ${BoxAddIcon({ width: 15, height: 15 })}
            </button>
          </hooli-tooltip>
          <hooli-tooltip text="edit this word">
            <button
              class="icon-button"
              @click="${() => (this.mode = 'editWord')}"
            >
              ${EditIcon({ width: 15, height: 15 })}
            </button>
          </hooli-tooltip>
          <hooli-menu>
            <li slot="list-item" @click="${() => (this.mode = 'deleting')}">
              ${DeleteIcon({ width: 15, height: 15 })} Delete
            </li>
          </hooli-menu>
        </div>`;
    };

    return html`
      <div id="heading-left">
        ${['newWord', 'editWord'].includes(this.mode)
          ? html`<input 
                name='word'
                type='text'
                id='word-input' class='editable' 
                @input="${this._handleValidInput}"
                 @keypress="${this._handleEnterSubmit}"
                 .value="${wordDefault}"
                 ></input>`
          : html`${this.mode === 'deleting'
                ? html`<input type='checkbox' class='checkbox' id='heading-word-delete-checkbox' @change="${this._handleCheckboxSelect}"></input>`
                : ''}
              <h3>${this.wordObj.word}</h3>`}
      </div>
      ${actionBar()}
    `;
  }

  _contextSection() {
    const definitionSelectorTemplate = () => {
      const definitionInput = (definitionObj) => {
        let definitionId = 'new';
        let note = '';
        let annotation = '';
        if (definitionObj) {
          definitionId = definitionObj.definitionId;
          note = definitionObj.note;
          annotation = definitionObj.aliases[0];
        }
        return html`
                    <div id=${
                      'definition-input-container-' + definitionId
                    } class='definition-input-container'>
                <hooli-tooltip 
                text='show when hover the word'
                placement='bottom-end'
                offset='5'
                >
            <input 
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
        const annotation = definitionObj.aliases[0];

        return html`<div class='definition-selectable' @click="${
          this._clickInsideRadio
        }">
                <input type='radio'  class='definition-selectable-radio'
                id=${'definition-selectable-' + definitionId}
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
        placeholder='context/sentence'
        minlength=1
        class="editable"
        value=${value}
        @keypress="${this._handleEnterSubmit}"
        @input="${this._handleValidInput}"
      ></hooli-textarea>`;
    };

    const matchRuleSelection = () => {
      const variantsInput = () => {
        let stem;
        stem = this.wordObj?.stem || '';
        setTimeout(() => {
          this.renderRoot.querySelector('#variants-input').tags =
            this.wordObj?.variants || [];
        });
        return html`
           <input id='stem-input' type='text' placeholder='stem' .value="${stem}"></input>
           <hooli-tags-input placeholder='variants' id='variants-input' ></hooli-tags-input>`;
      };

      if (this._formInputStatus.openMatchRule) {
        setTimeout(() => {
          this.renderRoot.querySelector(
            `#${this.wordObj?.matchRule || 'start'}`
          ).checked = true;
        });

        const radioButtonWithToolTip=(value)=>{
            return html`<hooli-tooltip>
            <hooli-highlighter  
            slot='tooltip-content'
            text="the @reallycoolguy in cooler is not supercool but that's cool"
             matchword='cool'
             matchrule=${value}
             ></hooli-highlighter>
            <input type='radio' name='match-rule' id=${value} value=${value}></input>
            <label for=${value}>${value}</label>
            </hooli-tooltip>`
        }

        return html`
            <div id='match-rule-selection-container'>
            <h6>Match Rule:
            <hooli-tooltip>
            <span class='icon-button'>${InfoIcon({ width: 13, height: 13})}</span>
            </hooli-tooltip>
            </h6>
            <div>
            ${radioButtonWithToolTip('start')}
            ${radioButtonWithToolTip('end')}
            ${radioButtonWithToolTip('independent')}
            ${radioButtonWithToolTip('any')}
          </div>
          <div>
          ${variantsInput()}
          </div>
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
          : ''}
      </div>`;
    };

    // if (this._loading) {
    //   return html`${this._spinner()}`;
    // }
    if (['newWord'].includes(this.mode)) {
      return html`
        ${matchRuleSelection()} 
        ${definitionSelectorTemplate()}
        ${editableContext(this.contextHere)}
        ${pageTitle(this._currentSiteIcoSrc, currentURL, document.title)}
      `;
    }
    if (this.mode === 'newContext') {
      return html`${definitionSelectorTemplate()}
      ${editableContext(this.contextHere)}
      ${pageTitle(this._currentSiteIcoSrc, currentURL, document.title)} `;
    }
    if (this.mode === 'editWord') {
      return html` 
      ${matchRuleSelection()} 
      ${definitionSelectorTemplate()} 
      `;
    }
    if (this.mode === 'editContext' && this._workingContext) {
      const contextId = this._workingContext;
      const contextObj = this.contexts.find(
        (contextObj) => contextObj.id === contextId
      );

      return html`
        ${definitionSelectorTemplate()}
         ${editableContext(contextObj.context)}
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
          <h6 class="annotation">${definition.aliases[0]}</h6>
          <p class="definition-note">${definition.note}</p>
          ${this.contexts
            .filter((contextObj) => contextObj.definitionRef === definition.definitionId)
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
                })?.img;
              }
              return html`
                <div class="outer-context-container">
                  <div class="vertical-line"></div>
                  <div class="inner-context-container">
                    ${this.mode === 'deleting' && this.contexts.length > 1
                      ? html`<input type='checkbox' class='checkbox context-delete-checkbox' id='c-${contextObj.id}' @change="${this._handleCheckboxSelect}"></input>`
                      : ''}
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
        <button @click="${this._handleCancel}" id="cancel-button">
          Cancel
        </button>
        <button @click="${this._handleFormSubmit}" id="submit-button">
          ${getSubmitButtonText()}
        </button>
      `;
  }

  _spinner() {
    if (this._loading) {
      return html`<hooli-spinner></hooli-spinner>`;
    }
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

  _handleFormSubmit(e) {
    // this._loading = true
    e.preventDefault()
    const formData = new FormData(this.renderRoot.querySelector('form'))
    console.log(Object.fromEntries(formData.entries()))
    formData.forEach((value, key) => console.log(`${key}: ${value}`));

    return
    if (this.mode === 'newWord') {
      const word = this.renderRoot.querySelector('#word-input').value.trim();
      const stem =
        this.renderRoot.querySelector('#stem-input')?.value.trim() || '';
      const variants =
        this.renderRoot.querySelector('#variants-input')?.tags || [];
      const matchRule =
        this.renderRoot.querySelector('input[name="match-rule"]:checked')?.id ||
        '';
      const annotation = this.renderRoot
        .querySelector('.annotation-input')
        .value.trim();
      const wordNote = this.renderRoot
        .querySelector('.long-note-textarea')
        .value.trim();
      const context = this.renderRoot
        .querySelector('#context-textarea')
        .value.trim();

      if (!word) {
        console.log('word!');
        return;
      }
      if (!annotation) {
        console.log('write sth on annotation plz');
        return;
      }
      if (!context) {
        console.log('context!');
        return;
      }
      console.log({ word, stem, variants, annotation, wordNote, context });

      if (myList.find((wordObj) => wordObj.word === word)) {
        this._helperText = 'this word is already exist'
        return
      }

      const theNewWord = {
        id: nanoid(),
        word,
        associationWOrdIds: [],
        definitionCount: 1,
        definitions: [
          {
            aliases: [annotation],
            definitionId: '0',
            note: wordNote,
            tags: [],
          },
        ],
        lang: [],
        matchRule,
        stem,
        variants,
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
        url: currentURL,
      };

      chrome.runtime.sendMessage(
        {
            action:'saveWordAndContext',
          newWord: theNewWord,
          newContext: theNewContext,
        },
        (response) => {
            console.log(response)
          if (response.status==='success') {
            // this._loading = false;
            myList.push(theNewWord);
            renderRuby(document.body, true);
            this.remove();
          }
          if(response.status==='existWord'){
            this._helperText = 'this word is already exist'
          }
        }
      );
    }

    if (this.mode === 'newContext') {
      const context = this.renderRoot
        .querySelector('#context-textarea')
        .value.trim();
      const word = this.wordObj.word;
      const wordId = this.wordObj.id;
      const annotation = this.renderRoot
        .querySelector('.annotation-input')
        ?.value.trim();
      const wordNote = this.renderRoot
        .querySelector('.long-note-textarea')
        ?.value.trim();

      if (!context) {
        console.log('please fill the context');
        return;
      }

      let definitionRef;
      let newDefinition;
      if (!this._formInputStatus.newDefinitionWhenDefinitionSelecting) {
        const splittedCheckedDefinitionId = this.renderRoot
          .querySelector('input[name="definition-select"]:checked')
          .id.split('-');
        definitionRef =
          splittedCheckedDefinitionId[splittedCheckedDefinitionId.length - 1];
      } else {
        definitionRef = `${this.wordObj.definitionCount || 1}`;
        newDefinition = {
          aliases: [annotation],
          definitionId: definitionRef,
          note: wordNote,
          tags: [],
        };
      }

      const newContext = {
        context,
        word,
        wordId,
        date: Date.now(),
        definitionRef,
        note: '',
        pageTitle: document.title,
        phrase: '',
        url: currentURL,
      };
      console.log(newContext);
      console.log(newDefinition);

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

      chrome.runtime.sendMessage(request, (response) => {
        // this._loading = false;
        console.log(response)
        if (response.status==='success') {
          console.log(response.message);
            if(newDefinition){
                this.wordObj = {...this.wordObj,
                    definitionCount:request.definitionCount,
                     definitions:[...this.wordObj.definitions, newDefinition] }  
                setTimeout(()=>{
                    updateWordObjToElementsAndWordList(this.wordObj)
                }) 
            }
            this._getContextsFromDB()
            this.mode = 'lookUp'    
        }
      });
    }

    if (this.mode === 'deleting') {
      console.log('delete!');
      const mainCheckEle = this.renderRoot.querySelector(
        '#heading-word-delete-checkbox'
      );
      if (mainCheckEle.checked) {
        const wordId = this.wordObj.id;
        chrome.runtime.sendMessage(
          {
            action: 'deleteThisWordObjAndAllItsContexts',
            wordId,
            contextIdsToDelete: this.contexts.map((context) => context.id),
          },
          (response) => {
            this._loading = false;
            console.log(response);
            if (response.status === 'success') {
              this.remove();
              restoreHolliText(wordId);
            }
          }
        );
        return;
      }
      const allContextCheckEles = this.renderRoot.querySelectorAll('.context-delete-checkbox');
      const contextIdsToDelete = [];
      allContextCheckEles.forEach((contextCheckEle) => {
        if (contextCheckEle.checked) {
          const splittedId = contextCheckEle.id.split('-');
          contextIdsToDelete.push(+splittedId[splittedId.length - 1]);
        }
      });
      if(contextIdsToDelete.length === 0){
        this._helperText = 'check to delete'
      }
      const allDefinitionRefs = {}
      if (contextIdsToDelete.length > 0) {
        this.contexts.forEach(contextObj=>{
            allDefinitionRefs[contextObj.definitionRef]?
            allDefinitionRefs[contextObj.definitionRef]++:
             allDefinitionRefs[contextObj.definitionRef] = 1
            if(contextIdsToDelete.includes(contextObj.id)){
                allDefinitionRefs[contextObj.definitionRef] --
            }
        })
        const definitionsToDelete =[];
        Object.entries(allDefinitionRefs).forEach(keyPair=>{
            if(keyPair[1]===0) definitionsToDelete.push(keyPair[0])
        })
        console.log(contextIdsToDelete,definitionsToDelete)

        const request = {contextIdsToDelete};
        if(definitionsToDelete.length > 0) {
            request.newDefinitions = this.wordObj.definitions.filter(definition=>{
                return !definitionsToDelete.includes(definition.definitionId)
            })
            request.action = 'deleteContextsAndDefinitions'
            request.wordId = this.wordObj.id
        }else{
            request.action = 'deleteContexts';
        }
        console.log(request)
        chrome.runtime.sendMessage(request,
          (response) => {
            console.log(response)
            if (response.status==='success') {
                this.contexts = this.contexts.filter(contextObj=>!contextIdsToDelete.includes(contextObj.id))
                if(request.action ==='deleteContextsAndDefinitions'){
                    // console.log('update wordObj')
                    this.wordObj = {...this.wordObj, definitions:request.newDefinitions}
                    setTimeout(()=>updateWordObjToElementsAndWordList(this.wordObj))
                }
                this.mode ='lookUp'

            }
          }
        );
        return
      }
    }
    if (this.mode === 'editWord') {
      const wordId = this.wordObj.id;
      // const matchRule = this.renderRoot.querySelector('#match-rule-selection')?.value
      const word = this.renderRoot.querySelector('#word-input').value.trim();
      const matchRule = this.renderRoot.querySelector(
        'input[name="match-rule"]:checked'
      )?.id;
      const stem = this.renderRoot.querySelector('#stem-input')?.value.trim();
      const variants = this.renderRoot.querySelector('#variants-input')?.tags;
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
          aliases: [annotation],
          note,
          tags: [],
        });
      });

      console.log(definitions, stem, variants, matchRule);

      chrome.runtime.sendMessage(
        {
          action: 'editWord',
          wordId,
          word,
          definitions,
          stem,
          variants,
          matchRule,
        },
        (res) => {
          if (res.status === 'success') {
            this.wordObj = {...this.wordObj,          
                word,
                definitions,
                stem,
                variants,
                matchRule
                }
            this.mode = 'lookUp'
            updateWordObjToElementsAndWordList(this.wordObj)
          }
        }
      );
    }
    if(this.mode === 'editContext'){
        const context = this.renderRoot
        .querySelector('#context-textarea')
        .value.trim();
        const contextId = this._workingContext;
        let definitionRef;       
        const splittedCheckedDefinitionId = this.renderRoot
        .querySelector('input[name="definition-select"]:checked')
        .id.split('-');
      definitionRef = splittedCheckedDefinitionId[splittedCheckedDefinitionId.length - 1];

        chrome.runtime.sendMessage({
            action:'editContext', context, contextId, definitionRef
        },(res)=>{
            console.log(res)
            if(res.status==='success'){
                this.mode ='lookUp'
                this._workingContext = null
                this._getContextsFromDB()
            }
        })
    }
    if (this.mode === 'highlighting') {
      const phrase = this._phraseSelection;
      const contextId = this._workingContext;
      chrome.runtime.sendMessage(
        {
          action: 'changePhraseToContext',
          phrase,
          contextId,
        },
        (res) => {
          if (res.status === 'success') {
            this.contexts = this.contexts.map((contextObj) => {
              if (contextObj.id === this._workingContext) {
                contextObj.phrase = this._phraseSelection;
              }
              return contextObj;
            });
          }
          this._handlePhraseSelect(contextId, false);
          this._phraseSelection = null;
          this._workingContext = null;
          this.mode = 'lookUp';
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
      // fetchingData = false
      const annotationInput =
        this.renderRoot.querySelector('.annotation-input');
      const originalAnnotation = annotationInput.value;
      annotationInput.value = pronounceDataResult + ' ' + originalAnnotation;
      // this._handleEleValidInput(annotationInput)
    }
  };
  _getContextsFromDB(){
    chrome.runtime.sendMessage(
        {  action: 'getContexts' ,
        wordId: this.wordObj.id
    },
        (response) => {
            // console.log(response.contexts)
          this.contexts = response.contexts;
          // this._loading = false
          const allDomains = response.contexts.map((contextObj) => {
            return new URL(contextObj.url).hostname;
          });
          chrome.runtime.sendMessage({
            action:'getImgDataFromUrls',
             domains: allDomains 
            }, (response) => {
            this.imgSrcs = response.domainData;
          });
        }
      );
  }
  firstUpdated() {
    const getFaviconThisSite = ()=>{
        chrome.runtime.sendMessage({ action: 'getFaviconThisSite' }, (res) => {
            this._currentSiteIcoSrc = res.iconUrl;
            console.log(res.iconUrl)
          });
    }
    window.addEventListener('mouseup', this._handleClose);
    if (this.mode === 'lookUp') {
        this._getContextsFromDB()
        
    }
    if (this.mode === 'newWord'){
        this._pronSearch();
        getFaviconThisSite()
        }
    if(this.mode === 'newContext'){
        getFaviconThisSite()
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
  }
//   connectedCallback() {
//     super.connectedCallback();
//   }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mouseup', this._handleClose);
  }
}

customElements.define('hooli-wordinfo-block', HooliWordInfoBlock);
