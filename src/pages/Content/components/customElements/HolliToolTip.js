import '@webcomponents/custom-elements';
import { LitElement, html, css } from 'lit';
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  inline,
} from '@floating-ui/dom';

class HooliToolTip extends LitElement {
  static get properties() {
    return {
      text: { type: String },
      placement: { type: String },
      offset: { type: String },
    };
  }
  constructor() {
    super();
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
      `,
  ];
  render() {
    return html`<span id="container"><slot></slot></span>
      <div id="tooltip">
        ${this.text}
        <slot name="tooltip-content"> </slot>
      </div> `;
  }

  firstUpdated() {
    // this.style.setProperty('--tip--content', `"${this.text}"`)
    const tooltip = this.renderRoot.querySelector('#tooltip');
    const container = this.renderRoot.querySelector('#container');

    const updatePosition = () => {
      computePosition(container, tooltip, {
        placement: this.placement,
        middleware: [offset(+this.offset), flip(), shift({ padding: 5 })],
      }).then(({ x, y }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };

    const showTooltip = () => {
      updatePosition();
      if (!tooltip.classList.contains('show-tooltip'))
        tooltip.classList.add('show-tooltip');
    };

    const hideTooltip = () => {
      if (tooltip.classList.contains('show-tooltip')) {
        tooltip.classList.remove('show-tooltip');
      }
    };
    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      ['focusin', showTooltip],
      ['focusout', hideTooltip],
      ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      container.addEventListener(event, listener);
    });
    updatePosition();
  }
}

customElements.define('hooli-tooltip', HooliToolTip);
