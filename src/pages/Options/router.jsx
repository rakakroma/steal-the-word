import React from 'react';

import { createHashRouter as createRouter, Navigate } from 'react-router-dom';
import { DefaultMainPage, MainPage } from './components/MainPage/MainPage';
import { Settings } from './components/Settings/Settings';
import Options from './Options';
import { SinglePageWordCollection } from './components/WordCollection/WordCollection';

export const router = createRouter([
  {
    path: '/',
    element: <Options />,
    children: [
      // errorElement: <ErrorPage />,
      { index: true, element: <Navigate to="/home/settings" replace={true} /> },
      {
        path: 'home',
        element: <MainPage />,
        children: [
          { index: true, element: <DefaultMainPage /> },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'words',
            element: <SinglePageWordCollection />,
          },
        ],
      },
    ],
  },
]);
