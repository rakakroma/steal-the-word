import React from 'react';

import { createHashRouter as createRouter, Navigate } from 'react-router-dom';
import { DefaultMainPage, MainPage } from './components/MainPage/MainPage';
import { Settings } from './components/Settings/Settings';
import Options from './Options';
import { SinglePageWordCollection } from './components/WordCollection/WordCollection';
import { ErrorPage } from './components/ErrorPage';
import { StylingBox } from './components/Settings/StylingBox';
import { ApiInfo } from './components/Settings/ApiInfo';
import { ImportAndExportBox } from './components/Settings/backupRestore/ImportAndExportBox';
import { OtherInfo } from './components/Settings/OtherInfo';

export const router = createRouter([
  {
    path: '/',
    element: <Options />,
    errorElement: <Options outlet={<ErrorPage />} />,

    children: [
      { index: true, element: <Navigate to="/home/settings" replace={true} /> },
      {
        path: 'home',
        element: <MainPage />,
        children: [
          { index: true, element: <DefaultMainPage /> },
          {
            path: 'settings',
            element: <Settings />,
            children: [
              {
                index: true,
                element: (
                  <Navigate to="/home/settings/text-styling" replace={true} />
                ),
              },
              { path: 'text-styling', element: <StylingBox /> },
              { path: 'lang-api', element: <ApiInfo /> },
              { path: 'backup-restore', element: <ImportAndExportBox /> },
              { path: 'about', element: <OtherInfo /> },
            ],
          },
          {
            path: 'collection',
            element: <SinglePageWordCollection />,
          },
        ],
      },
    ],
  },
]);
