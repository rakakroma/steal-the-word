import React from 'react';
import { render } from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import '../../utilsForAll/i18n';

render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
