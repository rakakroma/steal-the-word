
import '@webcomponents/custom-elements'
import { LitElement, html, css, unsafeCSS } from 'lit';
import {showWordList, wordInPageList} from '../infoSection'

class HooliWordListMinimizedBar extends LitElement{


    static styles =  [
        css`:host{
                width: 30px;
    height: 60px;
    background-color: #ede0e06c;
    box-shadow: 3.0px 6.1px 6.1px hsl(0deg 0% 0% / 0.41);
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  position:fixed;
  right:0px;
  top:100px;
  z-index:999999999;
        }
        :host(:hover){
            background-color: #ede0e0d3;

        }
        
        `
        
    ]

    render(){ 
        return html`<div @click="${this._handleOpenWordList}">
        10
        </div>`
    }
    _handleOpenWordList(){
        showWordList()
    }

}

customElements.define('hooli-wordlist-minimized-bar', HooliWordListMinimizedBar)

class HooliFloatingWordList extends LitElement {

    //     get properties (){
    //     return {
    //         wordListInThisPage:{type:Array},
    //     }
    // }

    // constructor(){
    //     super();
    //     this.wordListInThisPage = []
    // }

    static styles =[
        css`:host{
            font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            all: initial;
            background-color: rgb(239, 239, 239);
            width: 200px;
            color: rgb(0, 0, 0);
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 99999999999;
            overflow-y: overlay;
            display: flex;
            flex-direction: column;
            border: 1px solid grey;
             }

          ol{
            padding:0;
            list-style-type:none;
        }

      

            h3, h6{
            margin:0;
            font-weight:100;
            }
            h3{
                font-size:17px;
            }
            h6{
                font-size:14px;
            }

            button{
                border:none;
            }

          `
    ]

    _titleBar(){

        return html`<div id='title-bar'>
        <button class='title-action' @click="${this._handleRefresh}">refresh</button>
        <button class='title-action'>minimize</button>
        <button class='title-action'>close</button>
        </div>`
    }

    _wordList(){
        return html`<ul>
        ${wordInPageList.map(wordObj=>{
            return html`<li><h3>${wordObj.word}</h3><h6>${wordObj.definitions[0].aliases[0]}</h6></li>`
        })}
        <li>hihi</li>
        </ul>`
    }
    render(){

        return html`<div id='word-list-container'>
        ${this._titleBar()}
        ${this._wordList()}
        
        </div>
        `
    }
    _handleRefresh(){
        // this.wordListInThisPage = wordInPageList
        console.log(this.wordListInThisPage)
        console.log(`wordListInThisPage`)
    }

}
customElements.define('hooli-floating-word-list', HooliFloatingWordList)
