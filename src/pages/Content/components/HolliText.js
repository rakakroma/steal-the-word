import '@webcomponents/custom-elements'

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
            word: { type: String },
            alias: { type: String },
            contexts: { type: String },
            contextHere: { type: String },
            imgSrcs: { type: String },
            _phraseSelectionTarget: { state: true },
            _newContext: { state: true },
            _selection: { state: true }
        }
    }

    constructor() {
        super()
        this.word = ''
        this.contexts = ''
        this.alias = ''
        this.contextHere = ''
        this.imgSrcs = ''
        this._phraseSelectionTarget = false
        this._newContext = false
        this._selection = ''


    }

    static styles = [
        css`:host{
            z-index:9999999999;
            position:absolute;
            transform: translateX(-50%);
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

        }
        #container{
            width:320px;
            max-height:600px;
            overflow-y:overlay;
            background-color:white;
            color:black;
            display:flex;
            flex-direction:column;
            border:1px solid black;
            border-radius: 3px;
            padding:6px;
        }
        h3, h6{
            display:inline-block;
            margin:0;
        }
        p{
            font-size:0.7rem;
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
            width:310px;
            height:23px;
            display:flex;
            overflow:hidden;
        }
        .page-title>h6{
            font-size:0.5rem;
        }
        .date{
            color:grey;
            width:fit-content;
            margin-left:4px;
        }
        `
    ]


    newContextTemplate() {
        if (this._newContext) return html` <hooli-textarea  value=${this.contextHere}></hooli-textarea>`
        return
    }


    renderElement() {
        return html`<div id='container'>
        <button id='add-new-context' @click="${this._handleNewContext}">👍🏿</button>
        <div>
        <h3>${this.word}</h3>
        <h6>${this.alias}</h6>
        </div>
        ${this.newContextTemplate()}
        ${this.contexts ? this.contexts.map((contextObj, index) => {
            let src
            if (this.imgSrcs) {
                src = this.imgSrcs.find(domainObj => {
                    return domainObj.url === new URL(contextObj.url).hostname
                }).img
            }
            return html`
            ${this._handlePhraseBeenSelected(index)}
            <p id=${index}><hooli-highlighter text=${contextObj.context} matchword=${contextObj.phrase || contextObj.word}></hooli-highlighter>
                        <span class='date'>${dayjs(contextObj.date).isSame(dayjs(), 'year') ? dayjs(contextObj.date).format('M.D') : dayjs(contextObj.date).format('YY.M.D')}</span></p>
            <div class='page-title'>
            <a href=${contextObj.url}><img src=${src}></a>
            <h6>${contextObj.pageTitle}</h6>
            </div>
            `
        }) : ''}
        </div>`
    }

    render() {
        return html`
        ${this.renderElement()}`
    }

    _handleNewContext() {
        this._newContext = true
    }

    _handlePhraseBeenSelected(index) {
        // console.log(this._phraseSelectionTarget, '_phraseSelectionTarget')
        // console.log(index, 'index')
        // if (this._phraseSelectionTarget === `${index}`) return html`<span>hahahaha</span>`
        // if (this._phraseSelectionTarget) return html`<span>gotcha</span>`
        // return html`<span>${this._phraseSelectionTarget}</span>`
        if (this._selection) return html`<span>${this._selection}</span>`
    }

    _handlePhraseSelectionMonitor(e) {
        if (e.composedPath()[0].tagName === 'HOOLI-HIGHLIGHTER') {
            // this._phraseSelectionTarget = e.composedPath()[1].id
            // this._phraseSelectionTarget = true
            // console.log(this._phraseSelectionTarget, '_phraseSelectionTarget')
            console.log(e.composedPath())

            const handleSelect = () => {
                const selectedString = window.getSelection().toString().trim()
                if (selectedString) {
                    this._selection = selectedString
                }
            }

            document.addEventListener('selectionchange', handleSelect)
        }
        // if (e.composedPath()[0] !== 'HOOLI-WORDINFO-BLOCK') return
        // document.addEventListener('selectionchange', () => {
        //     console.log(document.getSelection().toString())
        // })

    }


    connectedCallback() {
        super.connectedCallback()
        window.addEventListener('mousedown', this._handlePhraseSelectionMonitor)
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
            value: { type: String }
        }
    }

    constructor() {
        super()
        this.value = ''
    }

    static styles = [
        css`textarea{
            font-family:inherit;
            font-size:0.8rem;
            resize: none;
            overflow: hidden;
            padding-left:5px;
            width:300px;
        }`
    ]

    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => this._handleAutoHeight(), 0)
    }

    render() {
        return html`<textarea @input="${this._handleAutoHeight}" .value=${this.value}></textarea>`
    }

    _handleAutoHeight() {
        const theTextArea = this.renderRoot.querySelector('textarea')
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
