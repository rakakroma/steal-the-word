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
import {
  Checkbox,
  Box,
  ListSubheader,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContextListContext, WordListContext } from './Options';
import { Collections, Home, Search, Settings } from '@mui/icons-material';

//FIXME: randomly break when looking long list, chrome error code 11, i have no idea what happeneded

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
                display: 'flex',
                p: 1,
                alignItems: 'center',
                background: active ? '#eee' : 'transparent',
                transition: 'background .1s ease-in',
              }}
            >
              <Box sx={{ pr: 1 }}>{item.icon}</Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mr: 4,
                    fontSize: item.type === 'context' ? '13px' : '16px',
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: '13px', color: '#5b5b5b' }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          )
        }
      />
    );
  };

  const navigate = useNavigate();

  const actions = [
    {
      id: 'word-search',
      name: 'Search Word',
      subtitle: 'by keywords of annotation and word',
      shortcut: ['s', 'w'],
      keywords: 'search find word where',
      icon: <Search color="action" size="small" />,
      section: 'action',
    },
    {
      id: 'home-page',
      name: 'Home Page',
      shortcut: ['m'],
      keywords: 'home',
      perform: () => navigate('home'),
      icon: <Home color="action" size="small" />,
      section: 'Navigate To',
    },
    {
      id: 'words-collection',
      name: 'Words Collection',
      shortcut: ['w', 'c'],
      keywords: 'words collection all',
      perform: () => navigate('home/collection'),
      icon: <Collections color="action" size="small" />,
      section: 'Navigate To',
    },
    {
      id: 'settings',
      name: 'Settings/Preferences',
      shortcut: ['s', 'p'],
      keywords: 'preferences',
      perform: () => navigate('home/settings'),
      icon: <Settings color="action" size="small" />,
      section: 'Navigate To',
    },

    // {
    //   id: 'context-search',
    //   name: 'Search Context',
    //   shortcut: ['s', 'c'],
    //   keywords: 'search find context sentence phrase',
    //   section: 'action',
    // },
  ];

  const theme = useTheme();

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner
          style={{
            zIndex: 99999,
            backgroundColor: '#8282826f',
          }}
        >
          <KBarAnimator
            style={{
              boxSizing: 'content-box',
              backgroundColor: 'white',
              minWidth: '500px',
              width: '60vw',
              borderRadius: '5px',
              padding: '5px',
              overflow: 'hidden',
              boxShadow: theme.shadows[3],
            }}
          >
            <KBarSearch
              style={{
                width: '-webkit-fill-available',
                border: 'none',
                outline: 'none',
                height: '26px',
                fontSize: '20px',
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
