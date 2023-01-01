import React, { useContext } from 'react';

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarResults,
  KBarAnimator,
  KBarSearch,
  useMatches,
  NO_GROUP,
  useRegisterActions,
} from 'kbar';

// import { KBarResults } from 'kbar-test';
import { Checkbox, Box, ListSubheader, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContextListContext, WordListContext } from './Options';
// import { KBarSearch } from './components/KBarSearch';

export const KBarCommandPalette = ({ children }) => {
  const RenderResults = () => {
    const { results, rootActionId } = useMatches();

    return (
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === 'string' ? (
            // section
            <Box
              sx={{
                fontSize: '12px',
                color: 'grey',
              }}
            >
              {item}
            </Box>
          ) : (
            <Box
              sx={{
                background: active ? '#eee' : 'transparent',
              }}
            >
              <Typography
                variant="span"
                sx={{
                  mr: '15px',
                  fontSize: item.type === 'context' ? '12px' : '16px',
                }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="span"
                sx={{ fontSize: '12px', color: '#5b5b5b' }}
              >
                {item.subtitle}
              </Typography>
            </Box>
          )
        }
      />
    );
  };

  const navigate = useNavigate();

  const actions = [
    {
      id: 'home-page',
      name: 'Home Page',
      shortcut: ['m'],
      keywords: 'home',
      perform: () => navigate('home'),
      section: 'Navigate To',
    },
    {
      id: 'words-collection',
      name: 'Words Collection',
      shortcut: ['w'],
      keywords: 'words collection all',
      perform: () => navigate('home/words'),
      section: 'Navigate To',
    },
    {
      id: 'settings',
      name: 'Settings/Preferences',
      shortcut: ['s', 'p'],
      keywords: 'preferences',
      perform: () => navigate('home/settings'),
      section: 'Navigate To',
    },
    {
      id: 'word-search',
      name: 'Search Word',
      shortcut: ['s', 'w'],
      keywords: 'search find word where',
      section: 'action',
    },
    // {
    //   id: 'context-search',
    //   name: 'Search Context',
    //   shortcut: ['s', 'c'],
    //   keywords: 'search find context sentence phrase',
    //   section: 'action',
    // },
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
              minWidth: '500px',
              width: '60vw',
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
                height: '26px',
                fontSize: '20px',
                borderBottom: '1px solid grey',
                marginBottom: '6px',
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
