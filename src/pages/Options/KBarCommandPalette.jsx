import React from 'react';

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from 'kbar';

import { Collections, Home, Search, Settings } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18next from 'i18next';

//FIXME: randomly break when looking long list, chrome error code 11, i have no idea what happeneded

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

export const KBarCommandPalette = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      id: 'word-search',
      name: t('Search Word'),
      subtitle: t('by keywords of annotation and word'),
      shortcut: ['s', 'w'],
      keywords: 'search find word where 搜尋 查 單字 找 検索　単語',
      icon: <Search color="action" size="small" />,
      section: t('action'),
    },
    {
      id: 'home-page',
      name: t('Home Page'),
      shortcut: ['m'],
      keywords: 'home',
      perform: () => navigate('home'),
      icon: <Home color="action" size="small" />,
      section: t('Navigate To'),
    },
    {
      id: 'words-collection',
      name: t('Words Collection'),
      shortcut: ['w', 'c'],
      keywords: 'words collection all 收藏 單字 単語　コレクション',
      perform: () => navigate('home/collection'),
      icon: <Collections color="action" size="small" />,
      section: t('Navigate To'),
    },
    {
      id: 'settings',
      name: t('Settings/Preferences'),
      shortcut: ['s', 'p'],
      keywords: 'preferences',
      perform: () => navigate('home/settings'),
      icon: <Settings color="action" size="small" />,
      section: t('Navigate To'),
    },
    {
      id: 'change-language',
      name: t('Language'),
      shortcut: ['s', 'p'],
      keywords: 'language change',
      icon: <Settings color="action" size="small" />,
      section: t('settings'),
    },
    {
      id: 'change-to-en',
      name: 'English',
      keywords: 'english en us',
      perform: () => {
        i18next.changeLanguage('en');
      },
      section: t('Language'),
      parent: 'change-language',
    },
    {
      id: 'change-to-ja',
      name: '日本語',
      keywords: 'japanese ja 日本語 nihongo ',
      perform: () => {
        i18next.changeLanguage('ja');
      },
      section: t('Language'),
      parent: 'change-language',
    },
    {
      id: 'change-to-zhTW',
      keywords: 'zh-tw chinese traditional taiwan',
      name: '繁體中文',
      perform: () => {
        i18next.changeLanguage('zh-TW');
      },
      section: t('Language'),
      parent: 'change-language',
    },
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
              defaultPlaceholder={t('type to search or do something')}
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
