import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import styled from 'styled-components';
import { StyleSheetManager } from 'styled-components';
import { ActionBar, WordRating } from './WordBlock/Heading';

const Baaa = styled.div`
  color: red;
`;

class MyShadowDomComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // ReactDOM.render(<Provider store={store}>
    //   <ConnectedCounter />
    // </Provider>
    // , shadowRoot);
    ReactDOM.render(
      <StyleSheetManager target={shadowRoot}>
        {/* <WordRating /> */}
        abcd
      </StyleSheetManager>,
      shadowRoot
    );
  }
}

customElements.define('my-shadow-dom-component', MyShadowDomComponent);
