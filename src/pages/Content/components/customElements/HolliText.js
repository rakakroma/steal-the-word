import '@webcomponents/custom-elements'
import { AssetsAddedIcon, EditIcon, CheckmarkIcon, CloseIcon, BoxAddIcon, MoreIcon } from '@spectrum-web-components/icons-workflow';
import { LitElement, html, css } from 'lit';
import { getSentenceFromSelection } from '../../utils/get-selection-more.ts'
import './HooliWordInfoBlock.js'
import { setWordBlockPosition } from '../../utils/setWordBlockPosition'

export const openAddNewWord = ()=>{
    if(!document.getSelection().toString().trim()) return
    const existingWordBlock = document.querySelector('hooli-wordinfo-block')
    existingWordBlock?.remove()
    const wordBlock = document.createElement('hooli-wordinfo-block')
    wordBlock.mode = 'newWord'
    wordBlock.newWord = document.getSelection().toString().trim()
    wordBlock.contextHere = getSentenceFromSelection(document.getSelection())

    setWordBlockPosition(window.getSelection().getRangeAt(0), wordBlock)
    document.getSelection()?.removeAllRanges()
    document.body.appendChild(wordBlock)
}

class HooliText extends LitElement {
    static get properties() {
        return {
            ruby: { type: Boolean },
            // alias: { type: String },
            wordObj: {type: Object}
        }
    }

    constructor() {
        super();
        this.ruby = false;
        // this.alias = '';
        this.wordObj = null;
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
        return html`<span @click="${this.openWordBlock}" class='span container' data-alias=${this.alias}><slot></slot></span>`
    }

    render() {
        return html`${this.renderElement()}`
    }
    _showHoverTip() {
        const smallTip = document.createElement('hooli-smalltip')
        smallTip.alias = this.wordObj.definitions[0].aliases[0]
        smallTip.style.bottom = `${window.innerHeight - this.getBoundingClientRect().top + 4}px`
        smallTip.style.left = `${this.getBoundingClientRect().left + this.offsetWidth / 2}px`
        this.addEventListener('mouseout', () => {
            const tip = document.querySelector('hooli-smalltip')
            if (tip) document.body.removeChild(tip)
        })
        document.body.appendChild(smallTip)
    }
    openWordBlock(){
            const wordBlock = document.createElement('hooli-wordinfo-block')
            let contextHere = ''
            chrome.runtime.sendMessage({ wordId: this.wordObj.id }, (response) => {
                wordBlock.contexts = response.contexts
                // console.log(response.contexts)
                const allDomains = response.contexts.map(contextObj => {
                    return new URL(contextObj.url).hostname
                })
                chrome.runtime.sendMessage({ domains: allDomains }, (response) => {
                    wordBlock.imgSrcs = response.domainData
                })
            })
            wordBlock.wordObj = this.wordObj
            wordBlock.context = ''
            wordBlock.contextHere = contextHere

            const range = document.createRange()
            range.selectNode(this)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(range)
            wordBlock.contextHere = getSentenceFromSelection(document.getSelection())
            window.getSelection().removeAllRanges()
            
           
            setWordBlockPosition(this, wordBlock)

             document.body.appendChild(wordBlock)
             const floatingWordList = document.querySelector('hooli-floating-word-list')
       if(floatingWordList){
        const idSplitByDash = this.id.split('-')
        const currentFocusCount = +idSplitByDash[idSplitByDash.length-1]
        floatingWordList.gotLookingWord(this.wordObj.id, currentFocusCount)
        // floatingWordList.lookingWord = {...this.wordObj, currentFocusCount}
       }
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



class HooliTextarea extends LitElement {

    static get properties() {
        return {
            value: { type: String },
            placeholder: { type: String },
            maxLength: {type: Number}
            // highlightText: { type: String }
        }
    }

    constructor() {
        super()
        this.value = '';
        this.placeholder = '';
        this.maxLength = 460;
        // this.highlightedText = ''
    }

    static styles = [
        css`textarea{
            font-family:inherit;
            font-size:13px;
            resize: none;
            overflow: hidden;
            padding-left:5px;
            width: -webkit-fill-available;
            width: -moz-fill-available;
            width: -moz-available;
            width: fill-available;
            color:inherit;
            background-color:inherit;
            border:none;
        }
        textarea:focus{
            outline: none;
        }
        `
    ]

    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => this._handleAutoHeight(), 0)
    }

    render() {
        return html`<textarea
         @input="${this._handleAutoHeightAndUpdateValue}" 
         placeholder="${this.placeholder}"
         maxLength = "${this.maxLength}"
         .value=${this.value}></textarea>`

    }

    _handleAutoHeightAndUpdateValue(e) {
        this._handleUpdateValue(e)
        this._handleAutoHeight()
    }


    _handleUpdateValue(e) {
        this.value = e.target.value
    }
    _handleAutoHeight() {
        const theTextArea = this.renderRoot.querySelector('textarea')
        if (theTextArea.value.length < 16) {
            theTextArea.style.height = "15px"
            return
        }
        theTextArea.style.height = 'auto'
        theTextArea.style.height = theTextArea.scrollHeight + "px"
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

class HooliAddingTool extends LitElement {
    // static get properties() {
    //     return {

    //     }
    // }

    // constructor(){
    //     super()
    // }

    static styles = [
        css`
        :host{
            z-index:999999999;
            position: absolute;
        }
        button{
            background:white;
            color:#19d819;
            border-radius:8px;
            border:none;
        }
        `
    ]

    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => window.addEventListener('click', this._handleClose))
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('click', this._handleClose)
    }

    render() {
        return html`
                <button @click="${this._handleAddText}">${BoxAddIcon({ width: 18, height: 18 })}</button>
`}

    get _thisElementOnBody() {
        return document.querySelector('hooli-adding-tool')
    }
    _handleAddText(e) {
        e.preventDefault()
        e.stopPropagation()
       openAddNewWord()
        setTimeout(() => this._thisElementOnBody.remove())
        return
    }
    _handleClose(e) {
        // console.log('trigger!') 
        if (!e.composedPath().some(node => node.tagName === 'HOOLI-ADDING-TOOL')) {
            // console.log('bye')
            setTimeout(() => document.querySelector('hooli-adding-tool').remove())
        }
    }
}
customElements.define('hooli-adding-tool', HooliAddingTool)

class HooliRelativeToolTip extends LitElement {

    static get properties() {
        return {
            text: { type: String }
        }
    }
    constructor() {
        super()
        this.text = '';
    }

    static styles = [
        css`:host{
        position:relative;
        --tip--content:''

    }
    span::before {
  content:  '' var(--tip--content) '';
  opacity: 0; /* はじめは隠しておく */
  visibility: hidden; /* はじめは隠しておく */
  position: absolute; /* 絶対配置 */
  left: 50%; /* 親に対して中央配置 */
  transform: translateX(-50%); /* 親に対して中央配置 */
  bottom: 17px;
  display: inline-block;
  padding: 3px; /* 余白 */
  font-size: 10px; /* フォントサイズ */
  line-height: 1.3; /* 行間 */
  background: rgb(241, 241, 241); /* 背景色 */
  color: rgb(0, 0, 0); /* 文字色 */
  border-radius: 3px; /* 角丸 */
  transition: 0.1s ease-in; /* アニメーション */
  z-index: 99999999;
  width:230px;
}

span:hover::before {
  opacity: 1;
  visibility: visible;
}

    `
    ]
    render() {
        return html`<span>
        <slot></slot>
        </span>`
    }

    connectedCallback() {
        super.connectedCallback()
        this.style.setProperty('--tip--content', `"${this.text}"`)

    }
}

customElements.define('hooli-relative-tooltip', HooliRelativeToolTip)

class HooliMenu extends LitElement {

    static get properties() {
        return {
            size: { type: Number },
            open: { type: Boolean }
        }
    }
    constructor() {
        super();
        this.size = 14;
        this.open = false;

    }

    static styles = [
        css`
        :host{
            position:relative;
        }
        button{
            border:none;
            background:#f3f3f3;
            cursor:pointer;
            color:black;
        }
        button.menu-hidden{
            background:white;
        }
        button:hover{
            background:#f3f3f3;
        }

        #menu-list{
            background: #f3f3f3;
            box-shadow: 3.0px 3.1px 3.1px hsl(0deg 0% 0% / 0.41);
            position:absolute;
            z-index:99999991;
            cursor:default;
            width:70px;
            top:1px;
            right:2px;
            padding:1px;
        }
        #menu-list.hidden{
            opacity:0;
        }

        ::slotted(li){
            list-style-type: none;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding:3px;
        }
        ::slotted(li:hover){
            background:#e4e3e4;
        }
        `
    ]

    get _menuListElement() {
        return this.renderRoot.querySelector('#menu-list')
    }
    get _actionButtonElement(){
        return this.renderRoot.querySelector('#action-button')
    }
    

    _actionButton() {
        return html`<button id='action-button' class='menu-hidden' @click="${this._handleOpenMenu}" >
        ${MoreIcon({ height: this.size, width: this.size })}
        </button>`
    }
    _menuList() {
        return html`<ul id='menu-list' class='hidden'>
        <slot></slot>
        </ul>
        `
    }

    render() {
        return html`${this._actionButton()}
                    ${this._menuList()}`
    }

    _handleOpenMenu(state) {

        const handleClickOutside  = (e)=>{
            if (!e.composedPath().some(node => node.id === 'menu-list')) {
                setTimeout(() => {
                    window.removeEventListener('mouseup',handleClickOutside)
                    this._handleOpenMenu(false)})
            }
        }
        if(state===true){
            this.open = true
        }else if(state === false){
            this.open = false
        }else{
            this.open = !this.open;
        }

        if (this.open) {
            if (this._menuListElement.className === 'hidden') this._menuListElement.className = ''
            if(this._actionButtonElement.className ==='menu-hidden') this._actionButtonElement.className = ''
            setTimeout(()=>window.addEventListener('mouseup',handleClickOutside))
        } else {
            if (!this._menuListElement.className) this._menuListElement.className = 'hidden'
            if(!this._actionButtonElement.className) this._actionButtonElement.className = 'menu-hidden'

        }
    }
}

customElements.define('hooli-menu', HooliMenu)

// class HooliMenuItem extends LitElement {

//     static get properties (){
//         return {
//             text:{type: String}

//         }
//     }

//     constructor() {
//         super();
//         this.text = ''
//         }
    
//         static styles = [
//             css`li{
//             list-style-type: none;
//             overflow: hidden;
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             padding:3px;
//             }
//             li:hover{
//                 background:#e4e3e4;
//             }
  
//             `
//         ]

//     render(){
//         return html`<li><slot></slot></li>`
//     }
//     }

//     customElements.define('hooli-menu-item', HooliMenuItem)
