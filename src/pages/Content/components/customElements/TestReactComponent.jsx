import { Button, Typography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

function MyReactApp() {
  return (
    <div>
      <Button variant="contained">Click me!</Button>
    </div>
  );
}

class MyShadowDomComponent extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const emotionRoot = document.createElement('style');
    const shadowRootElement = document.createElement('div');
    shadowRoot.appendChild(emotionRoot);
    shadowRoot.appendChild(shadowRootElement);

    const cache = createCache({
      key: 'css',
      prepend: true,
      container: emotionRoot,
    });
    ReactDOM.createRoot(shadowRootElement).render(
      <CacheProvider value={cache}>
        <MyReactApp />
      </CacheProvider>
    );
    // ReactDOM.render(<MyReactApp />, shadowRoot);
  }
}

customElements.define('my-shadow-dom-component', MyShadowDomComponent);

// const container = document.querySelector('#root');
// const shadowContainer = container.attachShadow({ mode: 'open' });
// const emotionRoot = document.createElement('style');
// const shadowRootElement = document.createElement('div');
// shadowContainer.appendChild(emotionRoot);
// shadowContainer.appendChild(shadowRootElement);

// const cache = createCache({
//   key: 'css',
//   prepend: true,
//   container: emotionRoot,
// });

// ReactDOM.createRoot(shadowRootElement).render(
//   <CacheProvider value={cache}>
//     <App />
//   </CacheProvider>
// );
