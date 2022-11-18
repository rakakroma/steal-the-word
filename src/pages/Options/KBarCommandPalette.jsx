import React from 'react';

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarResults,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP,
} from 'kbar';

import { Checkbox, Box } from '@mui/material';

export const KBarCommandPalette = ({ children }) => {
  const RenderResults = () => {
    const { results, rootActionId } = useMatches();

    return (
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === 'string' ? (
            <div>{item}</div>
          ) : (
            <div
              style={{
                background: active ? '#eee' : 'transparent',
              }}
            >
              {item.name}
            </div>
          )
        }
      />
    );
  };
  const actions = [
    {
      id: 'blog',
      name: '哈',
      shortcut: ['b'],
      keywords: 'writing words',
      perform: () => (window.location.pathname = 'blog'),
    },
    {
      id: 'contact',
      name: 'Contact',
      shortcut: ['c'],
      keywords: 'email',
      perform: () => (window.location.pathname = 'contact'),
    },
    {
      id: 'test',
      name: '真的假的',
      shortcut: ['z'],
      keywords: '壞 cool',
      perform: () => console.log('真'),
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner
          style={{
            // display: 'flex',
            // alignItems: 'center',
            backgroundColor: '#8282826f',
          }}
        >
          <KBarAnimator
            style={{
              boxSizing: 'content-box',
              backgroundColor: 'white',
              width: '500px',
              border: '1px solid grey',
              borderRadius: '5px',
              padding: '5px',
              overflow: 'hidden',
            }}
          >
            <KBarSearch
              style={{
                width: '-webkit-fill-available',
                border: 'none',
                outline: 'none',
                height: '16px',
              }}
            />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};
