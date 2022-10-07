import '@webcomponents/custom-elements'
import { AssetsAddedIcon, EditIcon, CheckmarkIcon, CloseIcon } from '@spectrum-web-components/icons-workflow';
// import { CheckmarkIcon } from '@spectrum-web-components/icons-workflow/src/icons.js';

import { LitElement, html, css, unsafeCSS } from 'lit';
import dayjs from "dayjs";


class HooliText extends LitElement {
    static get properties() {
        return {
            ruby: { type: Boolean },
            alias: { type: String },
        }
    }

    constructor() {
        super();
        this.ruby = false;
        this.alias = '';
    }

    static styles = [
        css`:host {
            cursor: pointer;
            color: white;
            background-color: slategray;
        }`
    ]

    renderElement() {

        if (this.ruby) {
            return html`<ruby class='container'>${this.text}<rt>${this.alias}</rt></ruby>`
        }
        return html`<span class='span container' data-alias=${this.alias}><slot></slot></span>`
    }

    render() {
        return html`${this.renderElement()}`
    }
    _showHoverTip() {
        const smallTip = document.createElement('hooli-smalltip')
        smallTip.alias = this.alias
        smallTip.style.bottom = `${window.innerHeight - this.getBoundingClientRect().top + 4}px`
        smallTip.style.left = `${this.getBoundingClientRect().left + this.offsetWidth / 2}px`
        this.addEventListener('mouseout', () => {
            const tip = document.querySelector('hooli-smalltip')
            if (tip) document.body.removeChild(tip)
        })
        document.body.appendChild(smallTip)
    }
    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('mouseover', this._showHoverTip)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('mouseover', this._showHoverTip)

    }
}

customElements.define('hooli-text', HooliText)




class HooliSmallTip extends LitElement {

    static get properties() {
        return {
            alias: { type: String },
            topPosition: { type: Number },
            leftPosition: { type: Number }
        }
    }
    constructor() {
        super()
        this.alias = '';
    }
    static styles = [
        css`:host{
        z-index:9999999999;
        position:fixed;
        transform: translateX(-50%);
        font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    }
    
    div{
       display: inline-block;
       padding: 3px; /* 余白 */
       white-space: nowrap; /* テキストを折り返さない */
       font-size: 0.8rem; /* フォントサイズ */
       line-height: 1.3; /* 行間 */
       background: rgb(241, 241, 241); /* 背景色 */
       color: rgb(0, 0, 0); /* 文字色 */
       border-radius: 3px; /* 角丸 */
       transition: 0.1s ease-in; /* アニメーション */

    }
    
    `
    ]
    render() {
        return html`<div>${this.alias}</div>`
    }
}
customElements.define('hooli-smalltip', HooliSmallTip)



class HooliWordInfoBlock extends LitElement {

    static get properties() {
        return {
            wordObj: { type: Object },
            contexts: { type: Array },
            contextHere: { type: String },
            imgSrcs: { type: Array },
            _phraseSelectionTarget: { state: true },
            _newContext: { state: true },
            _selectedWordAlias: { state: true },
            _selection: { state: true }
        }
    }

    constructor() {
        super()
        this.wordObj = ''
        this.contexts = ''
        this.contextHere = ''
        this.imgSrcs = ''
        this._phraseSelectionTarget = false
        this._newContext = false
        this._selectedWordAlias = ''
        this._selection = ''


    }

    static styles = [
        css`:host{
            font-size:12px;
            z-index:9999999999;
            position:absolute;
            transform: translateX(-50%);
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

        }
        #container{
            width:350px;
            max-height:600px;
            overflow-y:overlay;
            background-color:white;
            color:black;
            display:flex;
            flex-direction:column;
            border:1px solid black;
            border-radius: 5px;
            padding:6px;
        }
        h3{
            font-size:20px;
        }
        h3, h6{
            display:inline-block;
            margin:0;
        }
        p{
            font-size:13px;
            margin:0;
        }
        #add-new-context{
            position:absolute;
            top:-10px;
            right:-10px;
            background-color:lightgrey;
        }
        img{
            margin-right:6px;
            display:inline-block;
            height:20px;
            width:20px;
        }
        .page-title{
            width:340px;
            height:23px;
            display:flex;
        }
        .page-title>h6{
            font-size:0.5rem;
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
        `
    ]

    get _contextTextarea() {
        return this.renderRoot.querySelector('#context-textarea')
    }
    get _newDefinitionInputSpan() {
        return this.renderRoot.querySelector('.editing-definition')
    }


    _headingElement() {
        if (!this._newContext) return html`<button id='add-new-context' @click="${this._handleNewContext}">➕</button>
        <div>
         <h3>${this.wordObj.word}</h3>
        <h6>${this.wordObj.pronounce || this.wordObj.definitions[0].aliases[0]}</h6>
        </div>`
        return html`
        <div>
         <h3>${this.wordObj.word}</h3>
        </div>`
    }

    _newDefinitionElement() {
        if (this._selectedWordAlias === 'new') return html`
        <span  class='edit-word-alias'>
        <span class='icon'>${CheckmarkIcon({ width: 12, height: 12 })}</span>
        <span class='edit-instruction-text'>new :</span>
        <span contenteditable='true' class='editing-definition'></span>
        </span>
        <button class='icon-button' @click="${this._handleCloseNewDefinition}">
        ${CloseIcon({ width: 12, height: 12 })}
        </button>
        `
        return html`<button class='icon-button' @click="${this._handleNewDefinition}">
        ${AssetsAddedIcon({
            width: 18, // number outlining the width to deliver the SVG element with
            height: 18, // number outlining the height to delivery the SVG element with
            // hidden: false, // boolean representing whether to apply the `aria-hidden` attribute
            // title: 'Icon title', // string of the title to deliver the icon with
        })}
        </button>`
    }

    _selectingWordAlias(definition) {
        const alias = definition.aliases[0]

        if (this._selectedWordAlias === definition.definitionId) return html`
        <span class='selected-word-alias selectable-word-alias' id='${definition.definitionId}'>
        <span class='icon'>${CheckmarkIcon({ width: 12, height: 12 })}</span>
        <span>
        ${alias}
        </span>
        </span>`
        return html`<span class='unselected-word-alias selectable-word-alias' id='${definition.definitionId}'>
        ${alias}
        </span>`
    }
    _definitionSelectorTemplate() {

        //            <button class='icon-button edit-button'>${EditIcon({ width: 12, height: 12 })}</button>
        //             <span class='icon'>${CheckmarkIcon({ width: 12, height: 12 })}</span>

        return html`<div id='definition-selector'>
        ${this.wordObj.definitions.map((definition) => {
            // const alias = definition.aliases[0]

            // if (index === 0) return html`<span class='selected-word-alias selectable-word-alias' id='alias-${index}'>
            // ${alias}
            // </span>`
            // return html`<span class='unselected-word-alias selectable-word-alias' id='alias-${index}'>
            // ${alias}
            // </span>`
            return html`${this._selectingWordAlias(definition)}`
        })}
        ${this._newDefinitionElement()}
        </div>`
    }


    _newContextTemplate() {
        const currentURL = window.location.hash ?
            window.location.href.slice(0, window.location.href.lastIndexOf(window.location.hash)) :
            window.location.href
        const src = ''
        const pageTitle = document.title

        if (this._newContext) return html`
        ${this._definitionSelectorTemplate()}
        <input id='new-context-phrase-input' @change="${this._handleSelectPhrase}"></input>
         <hooli-textarea id='context-textarea' value=${this.contextHere}></hooli-textarea>
        <div class='page-title'>
        <a href=${currentURL}><img src=${src}></a>
        <h6>${pageTitle}</h6>
        </div>
        <button @click="${this._handleFormSubmit}">submit</button>`

        return
    }

    _contextSection() {
        if (!this._newContext && this.contexts) {

            return html`${this.contexts.map((contextObj, index) => {
                let src
                if (this.imgSrcs) {
                    src = this.imgSrcs.find(domainObj => {
                        return domainObj.url === new URL(contextObj.url).hostname
                    }).img
                }
                return html`
                <p id=${index}><hooli-highlighter text=${contextObj.context} matchword=${contextObj.phrase || contextObj.word}></hooli-highlighter>
                            <span class='date'>${dayjs(contextObj.date).isSame(dayjs(), 'year') ? dayjs(contextObj.date).format('M.D') : dayjs(contextObj.date).format('YY.M.D')}</span></p>
                <div class='page-title'>
                <a href=${contextObj.url}><img src=${src}></a>
                <h6>${contextObj.pageTitle}</h6>
                </div>
                `
            })}`
        }
        return
    }

    renderElement() {
        return html`<div id='container'>
        ${this._headingElement()}
        ${this._newContextTemplate()}
        ${this._contextSection()}
        </div>`
    }

    render() {
        return html`
        ${this.renderElement()}`
    }

    _handleNewContext() {
        this._newContext = true
    }

    _handleFormSubmit() {
        const context = this._contextTextarea.value
        let definitionId;
        let alias;
        if (this._selectedWordAlias !== 'new') {
            definitionId = this._selectedWordAlias
        } else {
            alias = this._newDefinitionInputSpan.textContent.trim()
        }

        console.log({
            context,
            definitionId,
            alias
        })
        chrome.runtime.sendMessage({ action: 'sendResponse' }, (res) => {
            console.log(res)
        })
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

    _handleSelectPhrase() {
        const phrase = this.renderRoot.querySelector('#new-context-phrase-input').value
        const contextElement = this.renderRoot.querySelector('hooli-textarea')
        const index = contextElement.value.indexOf(phrase)
        console.log(phrase, contextElement)
    }
    // _handlePhraseBeenSelected(index) {
    //     // console.log(this._phraseSelectionTarget, '_phraseSelectionTarget')
    //     // console.log(index, 'index')
    //     // if (this._phraseSelectionTarget === `${index}`) return html`<span>hahahaha</span>`
    //     // if (this._phraseSelectionTarget) return html`<span>gotcha</span>`
    //     // return html`<span>${this._phraseSelectionTarget}</span>`
    //     if (this._selection) return html`<span>${this._selection}</span>`
    // }

    // _handlePhraseSelectionMonitor(e) {
    //     if (e.composedPath()[0].tagName === 'HOOLI-HIGHLIGHTER') {
    //         // this._phraseSelectionTarget = e.composedPath()[1].id
    //         // this._phraseSelectionTarget = true
    //         // console.log(this._phraseSelectionTarget, '_phraseSelectionTarget')
    //         console.log(e.composedPath())

    //         const handleSelect = () => {
    //             const selectedString = window.getSelection().toString().trim()
    //             if (selectedString) {
    //                 this._selection = selectedString
    //             }
    //         }

    //         document.addEventListener('selectionchange', handleSelect)
    //     }
    //     // if (e.composedPath()[0] !== 'HOOLI-WORDINFO-BLOCK') return
    //     // document.addEventListener('selectionchange', () => {
    //     //     console.log(document.getSelection().toString())
    //     // })

    // }


    connectedCallback() {
        super.connectedCallback()
        window.addEventListener('mousedown', this._handlePhraseSelectionMonitor)
        this._selectedWordAlias = this.wordObj.definitions[0].definitionId
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('mousedown', this._handlePhraseSelectionMonitor)        // setTimeout(() => this._handleAutoHeight(), 0)
    }
}

customElements.define('hooli-wordinfo-block', HooliWordInfoBlock)





class HooliTextarea extends LitElement {

    static get properties() {
        return {
            value: { type: String },
            highlightText: { type: String }
        }
    }

    constructor() {
        super()
        this.value = ''
        this.highlightedText = ''
    }

    static styles = [
        css`textarea{
            font-family:inherit;
            font-size:0.8rem;
            resize: none;
            overflow: hidden;
            padding-left:5px;
            width:300px;
            color:inherit;
            background-color:inherit;
        }`
    ]

    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => this._handleAutoHeight(), 0)
    }

    render() {
        return html`<textarea
         @keydown="${this._preventPropagation}" 
         @keyup="${this._preventPropagation}" 
         @input="${this._handleAutoHeight}" 
         @change="${this._handleUpdateValue}"
         .value=${this.value}></textarea>`

    }

    _handleAutoHeight() {
        const theTextArea = this.renderRoot.querySelector('textarea')
        theTextArea.style.height = 'auto'
        theTextArea.style.height = theTextArea.scrollHeight + "px"
    }


    _preventPropagation(e) {
        e.stopPropagation()
    }
    _handleUpdateValue(e) {
        this.value = e.target.value
    }
}
customElements.define('hooli-textarea', HooliTextarea)




class hooliHighlighter extends LitElement {

    static get properties() {
        return {
            text: { type: String },
            matchWord: { type: String }
        }
    }
    constructor() {
        super()
        this.text = ''
        this.matchWord = ''
    }

    static styles = [
        css`.matched-word{
             background: linear-gradient(transparent 40%, #eea3a361 30%)
        }`
    ]

    render() {
        return html`${this._highlightedText()}`
    }

    _highlightedText() {
        if (!this.matchWord) return html`${this.text}`

        const regex = new RegExp(this.matchWord, "gi");
        const parts = this.text.split(regex);
        const matched = this.text.match(regex)
        if (parts.length === 1) return html`${this.text}`

        return (
            html`
                ${parts.map((part, i) => {
                if (i === parts.length - 1) {
                    return html`${part}`
                }
                return html`${part}<span class='matched-word'>${matched[i]}</span>`
            })}
            `
        );



    }
}

customElements.define('hooli-highlighter', hooliHighlighter)

