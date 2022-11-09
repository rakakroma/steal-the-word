import '@webcomponents/custom-elements'
import { LitElement, html, css } from 'lit';
import {  MoreIcon } from '@spectrum-web-components/icons-workflow';
import {
    computePosition,
    flip,
    shift,
    offset,
    arrow,
    inline
  } from '@floating-ui/dom';

  class HooliToolTip extends LitElement {

    static get properties() {
        return {
            text: { type: String },
            placement: {type: String},
            offset: {type: String}
        }
    }
    constructor() {
        super()
        this.text = '';
        this.placement = 'top';
        this.offset = '10';
    }

    static styles = [

        css`#tooltip {
        width: max-content;
        max-width:250px;
        overflow-wrap:break-word;
        position: absolute;
        top: 0;
        left: 0;
        padding: 4px;
        line-height: 1;
        background: rgb(64 64 64);
        color: rgb(242 242 242);
        border-radius: 3px;
        font-weight: bold;
        font-size: 12px;
        pointer-events: none;
        display:block;
        opacity: 0; 
        visibility: hidden;
        transition: 0.1s ease-in; 
        z-index:999999999;
      }
      #tooltip.show-tooltip{
        opacity:0.9;
        visibility:visible;

        v
      }
      `
    ]
    render() {
        return html`<span id='container'><slot></slot></span>
        <div id='tooltip'>
        ${this.text}
        <slot name='tooltip-content'>
        </slot>
        </div>
        `
    }


    firstUpdated() {
        // this.style.setProperty('--tip--content', `"${this.text}"`)
        const tooltip = this.renderRoot.querySelector('#tooltip')
        const container = this.renderRoot.querySelector('#container');
        
        const updatePosition = () =>{
            computePosition(container, tooltip, {
                placement: this.placement,
                middleware: [offset(+this.offset),flip(), shift({padding: 5})],
              }).then(({x, y}) => {
                Object.assign(tooltip.style, {
                  left: `${x}px`,
                  top: `${y}px`,
                });
              });
        }
    
        const showTooltip = ()=>{
            updatePosition()
            if(!tooltip.classList.contains('show-tooltip')) tooltip.classList.add('show-tooltip')
        }

        const hideTooltip = ()=>{
            if(tooltip.classList.contains('show-tooltip')){
                tooltip.classList.remove('show-tooltip')
            }
        }
        [
            ['mouseenter', showTooltip],
            ['mouseleave', hideTooltip],
            ['focusin', showTooltip],
            ['focusout', hideTooltip],
            ['blur', hideTooltip],
          ].forEach(([event, listener]) => {
            container.addEventListener(event, listener);
          });
          updatePosition()
    }
}

customElements.define('hooli-tooltip', HooliToolTip)


class HooliMenu extends LitElement {

    static get properties() {
        return {
            size: { type: Number },
            open: { type: Boolean },
        }
    }
    constructor() {
        super();
        this.size = 14;
        this.open = false;


    }

    static styles = [
        css`
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
            width:120px;
            top:0;
            right:0;
            padding:1px;
            display:block;
        }
        #menu-list.hidden{
            display:none;
        }

        ::slotted(li){
            list-style-type: none;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding:3px;
            user-select: none;
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
        return html`<button id='action-button' class='menu-hidden' @click="${this._handleToggleMenu}" >
        <slot name='button-text-or-icon'>${MoreIcon({ height: this.size, width: this.size })}</slot>
        </button>`
    }
    _menuList() {
        return html`<ul id='menu-list' class='hidden'>
        <slot name='list-item'></slot>
        </ul>
        `
    }

    render() {
        return html`${this._actionButton()}
                    ${this._menuList()}`
    }

    _handleToggleMenu(state) {

        const handleCloseWhenClick=(e)=>{
            if(
            (e.composedPath().some(node => node === this)) &&
            (e.composedPath().some(node => node.id === 'action-button'))
            ) return
            
                window.removeEventListener('mouseup',handleCloseWhenClick)
                handleCloseMenu()
        
    }

        const handleOpenMenu = ()=>{
            console.log('open')
            this._updatePosition()
            this.open = true;
                if (this._menuListElement.className === 'hidden') this._menuListElement.className = ''
                if(this._actionButtonElement.className ==='menu-hidden') this._actionButtonElement.className = ''
                setTimeout(()=>window.addEventListener('mouseup', handleCloseWhenClick))   
        }

        const handleCloseMenu= ()=>{
        console.log('close')
        this.open = false;
        window.removeEventListener('mouseup',handleCloseMenu)
        if (!this._menuListElement.className) this._menuListElement.className = 'hidden'
        if(!this._actionButtonElement.className) this._actionButtonElement.className = 'menu-hidden'
        }

    if(state===true){
        handleCloseMenu()
    }else if(state===false){
        handleOpenMenu()
    }else{
        this.open?
        handleCloseMenu():
        handleOpenMenu()
    }

    }

    _updatePosition(){
        const button = this.renderRoot.querySelector('#action-button')
        const floatingMenu = this.renderRoot.querySelector('#menu-list')

            computePosition(button, floatingMenu, {
                placement: this.placement,
                middleware: [offset(), flip(), shift({padding: 5})],
              }).then(({x, y}) => {
                Object.assign(floatingMenu.style, {
                  left: `${x}px`,
                  top: `${y}px`,
                });
              });
        }
    
    
}

customElements.define('hooli-menu', HooliMenu)
