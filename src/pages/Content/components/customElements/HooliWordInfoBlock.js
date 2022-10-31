import '@webcomponents/custom-elements'
import { AssetsAddedIcon, EditIcon, CheckmarkIcon, CloseIcon, BoxAddIcon, MoreIcon, GlobeSearchIcon, TextAddIcon } from '@spectrum-web-components/icons-workflow';
// import { CheckmarkIcon } from '@spectrum-web-components/icons-workflow/src/icons.js';

import { LitElement, html, css, unsafeCSS } from 'lit';
import dayjs from "dayjs";
import { getSentenceFromSelection } from '../../utils/get-selection-more.ts'
import { nanoid } from 'nanoid'
import { myList, floatingWindow } from '../../index'
import { renderRuby } from '../../utils/renderRuby'
import {fetchPronInfo} from '../../utils/fetchPronInfo'





const currentURL = window.location.hash ?
    window.location.href.slice(0, window.location.href.lastIndexOf(window.location.hash)) :
    window.location.href


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
            _selectedWordAlias: { state: true },
            _phraseSelection: { state: true },
            _wordPronounce: {state: true}
        }
    }

    constructor() {
        super()
        this.wordObj = {};
        this.contexts = [];
        this.contextHere = '';
        this.imgSrcs = [];
        this.mode = 'lookUp';
        this.newWord = '';
        this._currentSiteIcoSrc = '';
        this._selectedWordAlias = '';
        this._phraseSelection = '';
        this._wordPronounce = '';
        ['keydown', 'keyup', 'keypress'].forEach((event) => {
            this.addEventListener(event, this._stopPropagation)
        })

    }

    // #pron-contenteditable:empty:before{
    //     content: "type pronunciation if you need it";
    // }
    // #pron-container{
    //     height:18px;
    //     width:fit-content;
    //     max-width:280px;
    // }
    static styles = [
        css`:host{
            font-size:12px;
            z-index:9999999;
            position:absolute;
            transform: translateX(-50%);
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

        }
        #container{
            text-align:initial;
            width:350px;
            max-height:600px;
            overflow-y:overlay;
            background-color:white;
            color:black;
            display:flex;
            flex-direction:column;
            border:1px solid black;
            box-shadow: 3.0px 6.1px 6.1px hsl(0deg 0% 0% / 0.41);
            border-radius: 5px;
        }
        #container::-webkit-scrollbar {
  display: none;
}


        h3{
            font-size:20px;
            max-width:260px;
        }
        h3, h6{
            display:inline-block;
            margin:0;
        }
        p{
            font-size:12px;
            margin:0;
        }
        img{
            margin-right:6px;
            display:inline-block;
            height:16px;
            width:16px;
        }
        a{
            text-decoration:none;
        }
        .page-title{
            width:340px;
            height:21px;
            display:flex;
        }
        .page-title>h6{
            font-size:11px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

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
            display:grid;
        }
        .edit-word-alias, .selectable-word-alias{
            color:black;
            border-radius:4px;
            padding:0 2px;
            margin:0 4px;
            cursor: default;
        }
        .edit-word-alias, .selected-word-alias{
            border:2px solid #00a282;
            background-color:#d5fff2;
        }

        .unselected-word-alias{
            border:2px solid grey;
            background-color:white;
        }
        .edit-instruction-text{
            color:#11483d;
        }
        [contenteditable] {
  outline: 0px solid transparent;
        }
        [contenteditable]:empty:before{
          pointer-events: none;
          color:grey;
        }
        h3[contenteditable]:after{
            content: '';
            margin-left:10px;
            color:grey;
            font-size:10px;
        }
        h3:focus:after{
            content:''
        }

        .edit-word-alias:focus-within{
            border:2px solid #0439da;
        }
        .input-container{
            display:flex;
        }
        input{
            width:100%;
            background-color:white;
            border:none;
            color:black;
            outline:none;
        }
        #annotation-input:empty{
        }
        .divider{
            border: 0;
            display:block;
            width: 98%;               
            background-color:#000000;
            height: 1px;
            margin:0;
        }
        #submit-button{
            width:fit-content;
            color:black;
            background-color:white;
        }
        #heading-container{
            display:flex;
            justify-content:space-between;   
            padding:4px;
        }
        #submit-section{
            display:flex;
            justify-content:flex-end
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
            color:black;
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
        }
        h3.editable-valid:after{
            content: url("data:image/svg+xml,%3Csvg height='15px' viewBox='0 0 18 18' width='15px' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E .fill %7B fill: %23464646; %7D %3C/style%3E%3C/defs%3E%3Ctitle%3ES Checkmark 18 N%3C/title%3E%3Crect id='Canvas' fill='%23ff13dc' opacity='0' width='18' height='18'/%3E%3Cpath class='fill' d='M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z' style='fill: rgb(98, 222, 170);'/%3E%3C/svg%3E");
            position: absolute;
            bottom: 4px;
            right: -17px;
        }
        hooli-textarea.editable-valid:after{
            content: url("data:image/svg+xml,%3Csvg height='15px' viewBox='0 0 18 18' width='15px' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E .fill %7B fill: %23464646; %7D %3C/style%3E%3C/defs%3E%3Ctitle%3ES Checkmark 18 N%3C/title%3E%3Crect id='Canvas' fill='%23ff13dc' opacity='0' width='18' height='18'/%3E%3Cpath class='fill' d='M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z' style='fill: rgb(98, 222, 170);'/%3E%3C/svg%3E");
            position: absolute;
            bottom: 1px;
            right: 10px;
        }
        #context-textarea{
            outline:1px solid grey;
        }
        .single-context-container{
            margin:12px;
            padding:2px;
            border-radius:7px;
        }
        .inner-context-container{
            display:flex;

        }
        .count-context-num{
            font-size:14px;
            margin-right:10px;
        }
        #context-section{
        }
        `
    ]




    _actionBar() {

        const searchLinkButton =()=> html`<a href=https://www.google.com/search?q=${this.newWord || this.wordObj.word} target="_blank" >       
        ${GlobeSearchIcon({ width: 15, height: 15 })}
</a>
`

        if (['edit', 'newContext', 'newWord'].includes(this.mode)) return html` <div id='action-bar'>
        ${searchLinkButton()}
<button class='icon-button' id='add-variants-and-stem' >
${TextAddIcon({width:15, height:15})}
</button>
</div>`

        if (this.mode === 'lookUp') return html` <div id='action-bar'>
        ${searchLinkButton()}
<button class='icon-button' id='add-new-context' @click="${this._handleNewContext}"
>${BoxAddIcon({ width: 15, height: 15 })}
</button>
<button class='icon-button'>
${EditIcon({ width: 15, height: 15 })}
</button>
<hooli-menu>
<li>hi</li>
<li>hi</li>
<li>2021/12/20 — A tiny VS Code extension made up of a few commands that generate and insert lorem ipsum text into a text file. To use the extension</li>
</hooli-menu>
</div>`
    }



    _headingElement() {

        if (this.mode === 'newWord' || this.mode === 'edit') return html`
    <div id="heading-left">

        <h3 contenteditable='true' id='word-contenteditable' class='editable' @input="${this._handleValidInput}">${this.newWord}</h3>
    </div>
        ${this._actionBar()}`

        if (this.mode === 'newContext') return html`
        <div id="heading-left">
         <h3>${this.wordObj.word}</h3>
         </div>
         ${this._actionBar()}`

        if (this.mode === 'lookUp' || !this.mode) return html`
        <div id="heading-left">
         <h3>${this.wordObj.word}</h3>
        <h6>${this.wordObj.definitions[0].aliases[0]}</h6>
        </div>
        ${this._actionBar()}`
    }

    _newDefinitionElement() {
        if (this._selectedWordAlias === 'new') {

            if (this.mode === 'newWord') {
                setTimeout(() => { this.renderRoot.querySelector('#annotation-input').focus() }, 0)

                return html`
            <div class="input-container" >
        <input class='editable' placeholder='type annotation..' 
        @input="${this._handleValidInput}" @keypress="${this._handleEnterSubmit}"
        type="text" id="annotation-input" @change="${this._handleShortNote}">
        </input>
        </div>
        <hooli-textarea class='editable' id='long-note-textarea' placeholder="type note.. (optional)" @input="${this._handleValidInput}" @keypress="${this._handleEnterSubmit}"></hooli-textarea>

        `}
            if (['edit', 'newContext'].includes(this.mode)) {

                setTimeout(() => { this.renderRoot.querySelector('.editing-definition').focus() })

                return html`
        <span  class='edit-word-alias'>
        <span class='icon'>${CheckmarkIcon({ width: 12, height: 12 })}</span>
        <span class='edit-instruction-text'>new :</span>
        <span contenteditable='true' class='editing-definition'></span>
        </span>
        <button class='icon-button' @click="${this._handleCloseNewDefinition}">
        ${CloseIcon({ width: 12, height: 12 })}
        </button>
        `}
        }
        return html`<button class='icon-button' @click="${this._handleNewDefinition}">
        ${AssetsAddedIcon({width: 18,height: 18 })}
        </button>`
    }

    _selectingWordAlias(definition) {
        const alias = definition.aliases[0]

        if (this._selectedWordAlias === definition.definitionId) return html`
        <span class='selected-word-alias selectable-word-alias' id='${definition.definitionId}'>
        <span class='icon'>${CheckmarkIcon({ width: 12, height: 12 })}</span><span> ${alias} </span></span>`
        return html`<span class='unselected-word-alias selectable-word-alias' id='${definition.definitionId}'>
        ${alias}
        </span>`
    }

    _definitionSelectorTemplate() {
        if (Object.keys(this.wordObj).length === 0) {
            return html`<div id='definition-selector'>
            ${this._newDefinitionElement()}
            </div>
            `
        }
        return html`<div id='definition-selector'>
        ${this.wordObj.definitions.map((definition) => {

            return html`${this._selectingWordAlias(definition)}`
        })}
        ${this._newDefinitionElement()}
        </div>`
    }


    _contextSection() {

        const pageTitle = document.title
        const submitButtonText = () => {
            const texts = {
                newContext: "save new context",
                edit: "save edit",
                newWord: "save new word & context"
            }
            return texts[this.mode] + '⏎'
        }

        if (['newContext', 'edit', 'newWord'].includes(this.mode)) {
            chrome.runtime.sendMessage({ action: 'getFaviconThisSite' }, (res) => {
                this._currentSiteIcoSrc = res.iconUrl
            })
            // <input id='new-context-phrase-input'"></input>

            return html`
    ${this._definitionSelectorTemplate()}
     <hooli-textarea id='context-textarea' class='editable' 
     value=${this.contextHere}
      @keypress="${this._handleEnterSubmit}"
      @input="${this._handleValidInput}"
      ></hooli-textarea>
    <div class='page-title'>
    <img src=${this._currentSiteIcoSrc}>
    <h6>${pageTitle}</h6>
    </div>
    <div id='submit-section'>
    <button @click="${this._handleFormSubmit}" id="submit-button" >${submitButtonText()}</button>
    </div>
    `
        }

        if (this.mode === 'lookUp' && this.contexts) {

            return html`${this.contexts.map((contextObj, index) => {
                let src
                if (this.imgSrcs.length > 0) {
                    src = this.imgSrcs.find(domainObj => {
                        return domainObj.url === new URL(contextObj.url).hostname
                    }).img
                }
                return html`
                <div class='single-context-container'>
                <div class='inner-context-container'>
                <div class='count-context-num'>${index+1}</div>
            <p id=${index}><hooli-highlighter text=${contextObj.context} matchword=${contextObj.phrase || contextObj.word}></hooli-highlighter>
                        <span class='date'>${dayjs(contextObj.date).isSame(dayjs(), 'year') ? dayjs(contextObj.date).format('M.D') : dayjs(contextObj.date).format('YY.M.D')}</span></p>
                        </div>
                <div class='page-title'>
                <a href=${contextObj.url}><img src=${src}></a>
                <h6>${contextObj.pageTitle}</h6>
                </div>
                </div>
                `
            })}`
        }
        return
    }



    render() {
        return html`<div id='container'>
        <div id='heading-container'>
        ${this._headingElement()}
        </div>
        <hr class='divider'></hr>
        <div id='context-section'> 
        ${this._contextSection()}
        </div>
        </div>`
    }

    _handleValidInput(e) {
        let content = e.target.value || e.target.textContent
        if (content && content.trim()) {
            e.target.classList.add('editable-valid')
            return
        } else {
            if (e.target.classList.contains('editable-valid')) e.target.classList.remove('editable-valid')
            return
        }
    }

    _handleEleValidInput(ele) {
        const checkMark = document.createElement('span')
        checkMark.classList.add('icon', 'validCheckmark')
        checkMark.textContent = 'test123'

        if (ele.value || ele.textContent) {
            if (!ele.classList.contains('editable-valid')) {
                ele.classList.add('editable-valid')
                ele.appendChild(checkMark.cloneNode())
            }
        } else {
            if (ele.classList.contains('editable-valid')) {
                ele.classList.remove('editable-valid')
                ele.removeChild(ele.querySelector('.validCheckmark'))
            }
        }
    }

    _handleNewContext() {
        this.mode = 'newContext'
    }

    _handleFormSubmit() {

        if (this.mode === 'newWord') {
            const word = this.renderRoot.querySelector('#word-contenteditable').innerText.trim()
            // const pronunciation = this.renderRoot.querySelector('#pron-contenteditable').innerText.trim()
            const annotation = this.renderRoot.querySelector('#annotation-input').value.trim()
            const wordNote = this.renderRoot.querySelector('#long-note-textarea').value.trim()
            const context = this.renderRoot.querySelector('#context-textarea').value.trim()

            if (!word) {
                console.log('word!')
                return
            }

            if (!annotation ) {
                console.log('write sth on annotation plz')
                return
            }
            if (!context) {
                console.log('context!')
                return
            }
            console.log({ word, annotation, wordNote, context, pageTitle: this.pageTitle })

            const theNewWord = {
                id: nanoid(),
                word,
                associationWOrdIds: [],
                definitionCount: 1,
                definitions: [{
                    aliases: [annotation],
                    definitionId: '0',
                    note: wordNote,
                    tags: []
                }],
                lang: [],
                matchRule: '',
                stem: '',
                variants: []

            }

            const theNewContext = {
                context,
                word,
                wordId: theNewWord.id,
                date: Date.now(),
                definitionRef: '0',
                note: '',
                pageTitle: document.title,
                phrase: '',
                url: currentURL
            }

            if (myList.find(wordObj => wordObj.word === theNewWord.word)) {
                alert('stop!')
                return
            }

            chrome.runtime.sendMessage({
                newWord: theNewWord,
                newContext: theNewContext
            }, (response) => {

                if (response.message) {
                    console.log(response);
                    myList.push(theNewWord);
                    renderRuby(document.body, myList, { floatingWindow }, true)
                }
            });
        }


        if (this.mode === 'newContext'){
            const context = this.renderRoot.querySelector('#context-textarea').value.trim()
            const word = this.wordObj.word
            const wordId = this.wordObj.id
            if(!context) {
                console.log('please fill the context')
                return
            }
            const theNewContext = {
                context,
                word,
                wordId,
                date: Date.now(),
                definitionRef: '0',
                note: '',
                pageTitle: document.title,
                phrase: '',
                url: currentURL
            }

            console.log(theNewContext)
            chrome.runtime.sendMessage({
                action:'addNewContextForSavedWord',
                newContext: theNewContext
            }, (response) => {
                if (response.message) {
                    console.log(response.message);
                }
            });
        }


        // let definitionId;
        // let alias;
        // if (this._selectedWordAlias !== 'new') {
        //     definitionId = this._selectedWordAlias
        // } else {
        //     alias = this._newDefinitionInputSpan.textContent.trim()
        // }

        // chrome.runtime.sendMessage({ action: 'sendResponse' }, (res) => {
        //     console.log(res)
        // })
        // this._phraseSelection = 'ok from submit'
        // console.log(this._phraseSelection, '_phraseSelection')
    }

    _handleNewDefinition() {
        this._selectedWordAlias = 'new'
        setTimeout(() => {
            this._newDefinitionInputSpan.focus()
        })
    }
    _handleCloseNewDefinition() {
        this._selectedWordAlias = this.wordObj.definitions[0].definitionId
    }
    // _handleShortNote(e){
    //     console.log(e.target.value)
    // }
    _handleEnterSubmit(e) {
        if (e.key === 'Enter'  && !e.shiftKey) {
            e.preventDefault();
            this.renderRoot.querySelector('#submit-button').click()
        }
    }

    // _handleSelectPhrase() {
    //     const phrase = this.renderRoot.querySelector('#new-context-phrase-input').value
    //     // const contextElement = this.renderRoot.querySelector('hooli-textarea')
    //     const thisElement = document.querySelector('hooli-wordinfo-block')
    //     const contextAreaFromOutside = thisElement.shadowRoot.querySelector('hooli-textarea').shodowRoot.querySelector('')
    //     const index = contextAreaFromOutside.value.indexOf(phrase)
    //     console.log(phrase, index)
    //     if(index > 0){
    //         contextAreaFromOutside.setSelectionRange(index, phrase.length)
    //     }
    // }

    // _handleTriggerPhraseSelection(){
    //     const thisElement = document.querySelector('hooli-wordinfo-block')
    //     const contextAreaFromOutside = thisElement.shadowRoot.querySelector('hooli-textarea')

    //     window.addEventListener('selectionchange',()=>{
    //         console.log(document.getSelection().toString())
    //         this._phraseSelection = document.getSelection().toString()

    //     })
    // }

    _handleClose(e) {
        const thisElement = document.querySelector('hooli-wordinfo-block')
        const contextAreaFromOutside = thisElement.shadowRoot.querySelector('#context-textarea')
        // if (e.composedPath().includes(this._wordBlockOnBody)) return
        if (!e.composedPath().some(node => node.tagName === 'HOOLI-WORDINFO-BLOCK')) {
            setTimeout(() => thisElement.remove())
        }
        // else if(contextAreaFromOutside){

        //     if(contextAreaFromOutside.shadowRoot.getSelection().toString()){ //"getSelection in shadowRoot" seems not work in Firefox & Safari

        //         // selectionString = contextAreaFromOutside.shadowRoot.getSelection().toString()
        //         const string = contextAreaFromOutside.shadowRoot.getSelection().toString()
        //         this._phraseSelection = '12345656788990'
        //         console.log(this._phraseSelection)
        //         // this.renderRoot.querySelector('#new-context-phrase-input').value = selectionString
        //     }
        //     return
        // }

    }
    _stopPropagation(e) {
        e.stopPropagation()
    }

    _pronSearch = async(language)=>{
        const pronounceDataResult = await fetchPronInfo(this.newWord, this.contextHere)
        if(pronounceDataResult){
            // fetchingData = false
            const annotationInput = this.renderRoot.querySelector('#annotation-input')
            const originalAnnotation = annotationInput.value
            annotationInput.value = pronounceDataResult + " " + originalAnnotation 
             this._handleEleValidInput(annotationInput)
            }
    }


    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => { window.addEventListener('mouseup', this._handleClose) })
        if (Object.keys(this.wordObj).length > 0) {
            this._selectedWordAlias = this.wordObj?.definitions[0].definitionId
        } else {
            this._selectedWordAlias = 'new'
        }
        if(this.mode ==='newWord') {
            this._pronSearch()
            }

         setTimeout(() => {
                this.renderRoot.querySelectorAll('.editable').forEach(ele => {
                    this._handleEleValidInput(ele)
                })
         
         })

    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('mouseup', this._handleClose)
    }
}

customElements.define('hooli-wordinfo-block', HooliWordInfoBlock)
