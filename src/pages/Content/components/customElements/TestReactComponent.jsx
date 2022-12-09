import { Button, Typography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

// Create a React component to render inside the shadow root
function MyReactApp() {
  return (
    <div>
      {/* <h1>Hello from React!</h1> */}
      <Button variant="contained">Click me!</Button>
    </div>
  );
}

// Define your web component as usual, extending the HTMLElement class
class MyShadowDomComponent extends HTMLElement {
  connectedCallback() {
    // Use the `attachShadow` method to create a shadow root, specifying
    // the 'open' mode
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Use the `ReactDOM.render` method to render your React app inside
    // the shadow root
    ReactDOM.render(<MyReactApp />, shadowRoot);
  }
}

customElements.define('my-shadow-dom-component', MyShadowDomComponent);
