import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import '../../utilsForAll/i18n';
import { createRoot } from 'react-dom/client';

const root = createRoot(window.document.querySelector('#app-container'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

if (module.hot) module.hot.accept();
