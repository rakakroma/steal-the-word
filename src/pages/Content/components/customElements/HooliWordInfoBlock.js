import '@webcomponents/custom-elements';

import { html, LitElement } from 'lit';
import { getAllMatchTextFromWordObj } from '../../../../utilsForAll/getInfoFromWordObj';
// import { myList } from '../../index';
import './HolliToolTip';
import './WordBlock/HooliMenu';
import './WordBlock/HooliSelectableTagsInput';
import './WordBlock/HooliTextarea';
import './WordBlock/HooliVariantsInput';
import './WordBlock/HooliTag';
import { submitDelete } from './WordBlock/form/submitDelete';
import { submitEditContext } from './WordBlock/form/submitEditContext';
import { submitEditWord } from './WordBlock/form/submitEditWord';
import { submitNewContext } from './WordBlock/form/submitNewContext';
import { submitNewHighlight } from './WordBlock/form/submitNewHighlight';
import { submitNewWord } from './WordBlock/form/submitNewWord';
import { headingElement } from './WordBlock/heading/headingElement';
import { contextSection } from './WordBlock/main/contextBlock';
import { submitSection } from './WordBlock/submitSection';
import {
  iconButtonStyle,
  wordInfoBlockStyles,
  zIndexStyle,
} from './WordBlock/wordInfoBlockStyles';
import {
  findDuplicateWord,
  getTagList,
  getWordById,
} from '../../redux/wordDataSlice';
import { store } from '../../redux/store';
import { connect } from 'pwa-helpers';
import {
  getContextsDataFromDB,
  getFaviconThisSiteFromDB,
} from '../../redux/messageWithBackground';
import {
  getCurrentSiteImgSrc,
  getWordContexts,
  getWordImgSrcs,
} from '../../redux/wordBlockSlice';
import { getApiSetting } from '../../redux/workingPreferenceSlice';
import { getLang } from '../../utils/getLang';
import { fetchPronInfo } from '../../../Background/fetchData';

export const initialFormInputStatus = {
  editingTagDefId: null,
  workingContext: null,
  phraseSelection: '',
  openMatchRule: false,
  newDefinitionWhenDefinitionSelecting: false,
  helperText: '',
  submitting: false,
};

class HooliWordInfoBlock extends connect(store)(LitElement) {
  static get properties() {
    return {
      wordObj: { type: Object },
      contexts: { type: Array },
      newWord: { type: String },
      contextHere: { type: String },
      imgSrcs: { type: Array },
      mode: { type: String },
      tagList: { type: Array },
      apiSetting: { type: Object },
      _currentSiteIcoSrc: { state: true },
      _formInputStatus: { state: true },
    };
  }

  constructor() {
    super();
    this.newWord = '';
    this.contextHere = '';
    this.mode = 'lookUp'; //'lookUp', 'newWord','newContext','editWord','editContext','highlighting'
    this._formInputStatus = { ...initialFormInputStatus };
    ['keydown', 'keyup', 'keypress'].forEach((event) => {
      this.addEventListener(event, this._stopPropagation);
    });
  }

  stateChanged(state) {
    this.wordObj = getWordById(state, this.className.slice(2));
    this.contexts = getWordContexts(state);
    this.imgSrcs = getWordImgSrcs(state);
    this._currentSiteIcoSrc = getCurrentSiteImgSrc(state);
    this.tagList = getTagList(state);
    this.apiSetting = getApiSetting(state);
  }

  static styles = [zIndexStyle, wordInfoBlockStyles, iconButtonStyle];

  _matchWordsArray() {
    return getAllMatchTextFromWordObj(this.wordObj);
  }

  render() {
    if (!this.wordObj && this.mode !== 'newWord') {
      return html`<div id="container">Loading</div>`;
    }
    return html`<div id="container">
      <form>
        <div id="heading-container">${headingElement(this)}</div>
        <div id="context-section">${contextSection(this)}</div>
        <div id="submit-section">${submitSection(this)}</div>
      </form>
    </div>`;
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

  _toLookUpMode() {
    if (this.mode === 'highlighting') {
      this.handlePhraseSelect(this._formInputStatus.workingContext, false);
    }
    this.mode = 'lookUp';
    this._formInputStatus = { ...initialFormInputStatus };
  }

  _handleCancel() {
    if (this.mode === 'newWord') {
      this.remove();
      return;
    }
    this._toLookUpMode();
  }

  _formValidation(targetNames, targetValues, options) {
    if (options) {
      if (options.includes('newWord')) {
        if (findDuplicateWord(targetValues.word, store.getState())) {
          this._handleUpdateFormStatus(
            'helperText',
            'this word is already exist'
          );
          return false;
        }
      }
      if (options.includes('delete')) {
        if (targetValues['allCheckedName'].length === 0) {
          this._handleUpdateFormStatus(
            'helperText',
            'please fill the checkbox'
          );
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
          this._handleUpdateFormStatus(
            'helperText',
            'please check one of the definitions or add new one'
          );
          return false;
        }
      }
    }
    const lackedValueNames = [];
    targetNames.forEach((targetName) => {
      if (!targetValues[targetName]) lackedValueNames.push(targetName);
    });

    if (lackedValueNames.length > 0) {
      this._handleUpdateFormStatus(
        'helperText',
        `Please fill ${lackedValueNames.join(',')}.`
      );
      return false;
    }
    return true;
  }
  _handleFormSubmit(e) {
    e.preventDefault();
    if (this.mode === 'highlighting') {
      submitNewHighlight(this);
    }

    const formData = new FormData(this.renderRoot.querySelector('form'));
    const formObj = Object.fromEntries(formData.entries());

    if (this.mode === 'deleting') {
      submitDelete(this, formObj);
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
    // console.log({
    //   word,
    //   annotation,
    //   stem,
    //   matchRule,
    //   selectedDefinitionId,
    //   context,
    //   wordNote,
    //   variants,
    // });

    if (this.mode === 'newWord') {
      submitNewWord(
        this,
        word,
        annotation,
        context,
        wordNote,
        matchRule,
        stem,
        variants
      );
    }

    if (this.mode === 'newContext') {
      submitNewContext(
        this,
        context,
        selectedDefinitionId,
        annotation,
        wordNote
      );
    }
    if (this.mode === 'editWord') {
      submitEditWord(this, word, stem, variants, matchRule);
    }
    if (this.mode === 'editContext') {
      submitEditContext(this, context, selectedDefinitionId);
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

  handleContextEdit(contextId) {
    this.mode = 'editContext';
    this._handleUpdateFormStatus('workingContext', contextId);
  }

  handlePhraseSelect(contextId, state) {
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
          // this._formInputStatus.phraseSelection = selectedText;
          this._handleUpdateFormStatus('phraseSelection', selectedText);
        }
      }
    };
    if (state === false) {
      thisShadowRoot.removeEventListener('mouseup', getSelectText);
      return;
    }
    thisShadowRoot.addEventListener('mouseup', getSelectText);
    this._formInputStatus.phraseSelection =
      targetContextObj.phrase || this.wordObj.word;
    // this._formInputStatus.workingContext = contextId;
    this._handleUpdateFormStatus('workingContext', contextId);
    this.mode = 'highlighting';
  }

  _handleClose(e) {
    const thisEle = document.querySelector('hooli-wordinfo-block');
    if (
      thisEle &&
      !e.composedPath().some((node) => node.tagName === 'HOOLI-WORDINFO-BLOCK')
    ) {
      thisEle.remove();
    }
  }
  _stopPropagation(e) {
    e.stopPropagation();
  }

  _pronSearch = async () => {
    if (!this.apiSetting.enabled) return;
    const lang = await getLang(this.newWord, this.contextHere, this.apiSetting);
    if (!lang) return;
    // const { pron, definition } = await fetchPronInfo(
    //   this.newWord,
    //   this.contextHere,
    //   this.apiSetting,
    //   lang
    // );
    const { pron, definition } = await chrome.runtime.sendMessage({
      action: fetchPronInfo,
      targetWord: this.newWord,
      contextHere: this.contextHere,
      langOptions: this.apiSetting,
      lang,
    });

    if (pron) {
      const annotationInput =
        this.renderRoot.querySelector('.annotation-input');
      if (!annotationInput) return;
      const originalAnnotation = annotationInput.value;
      annotationInput.value = pron + ' ' + originalAnnotation;
      // this._handleEleValidInput(annotationInput)
    }
    if (definition) {
      const noteInput = this.renderRoot.querySelector('.long-note-textarea');
      if (!noteInput) return;
      noteInput.value = definition + '' + noteInput.value;
    }
  };

  firstUpdated() {
    window.addEventListener('mouseup', this._handleClose);
    if (!this._currentSiteIcoSrc) {
      store.dispatch(getFaviconThisSiteFromDB());
    }
    if (this.mode === 'lookUp') {
      store.dispatch(
        getContextsDataFromDB({ wordId: this.wordObj.id, force: false })
      );
    }
    if (this.mode === 'newWord') {
      this._pronSearch();
    }
    if (this.mode === 'newContext') {
    }

    if (this.wordObj) {
      if (
        this.wordObj.stem ||
        this.wordObj.matchRule ||
        this.wordObj.variants?.length > 0
      ) {
        this._handleUpdateFormStatus('openMatchRule', true);
      }
    }
    // this.renderRoot.querySelectorAll('.editable').forEach(ele => {
    //     this._handleEleValidInput(ele)
    // })
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
