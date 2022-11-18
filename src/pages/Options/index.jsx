import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';
import {
  createHashRouter as createRouter,
  RouterProvider,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { MainPage } from './components/MainPage';

const Index = () => {
  return <h4>i'm index 🤔</h4>;
};

const test = '1234';
const router = createRouter([
  {
    path: '/',
    element: <Options />,
    children: [
      {
        // errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            // path: "contacts/:contactId",
            path: 'main',
            element: <MainPage test={test} />,
            // loader: contactLoader,
            // action: contactAction,
          },
        ],
      },
    ],
  },
  {
    path: 'kkkk',
    element: <h2>kkkkk</h2>,
  },
]);

render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
