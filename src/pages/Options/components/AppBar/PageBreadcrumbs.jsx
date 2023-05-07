import {
  ArrowDropDown,
  Backup,
  CollectionsBookmark,
  Error,
  FormatColorFill,
  Info,
  Language,
  Settings,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useLocation, useRouteError } from 'react-router-dom';
import { HoveringNav } from './HoveringNav';
import { useTranslation } from 'react-i18next';
import { allSettingsRoute } from '../Settings/Settings';

const pathIcon = {
  home: <HomeIcon />,
  settings: <Settings />,
  collection: <CollectionsBookmark />,
  'text-styling': <FormatColorFill />,
  'lang-api': <Language />,
  'backup-restore': <Backup />,
  about: <Info />,
};

export const PageBreadcrumbs = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const pathArray = pathname.split('/').slice(1);
  const theme = useTheme();
  const error = useRouteError();

  const isCorrectPathName = (currentPathTargetName) =>
    Object.keys(pathIcon).includes(currentPathTargetName);

  return (
    <HoveringNav pathIcon={pathIcon} pathArray={pathArray}>
      <Breadcrumbs
        sx={{
          width: 'max-content',
          marginX: theme.spacing(2),
          alignItems: 'normal',
          cursor: 'default',
          flexGrow: 0,
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'nowrap',
          },
        }}
      >
        {pathArray.map((pathTarget, index) => {
          const last = index === pathArray.length - 1;
          if (error && !last) return null;
          return (
            <Box
              sx={{
                display: 'flex',
                wordBreak: 'keep-all',
                textTransform: 'capitalize',
              }}
              color="text.primary"
              key={pathTarget}
            >
              {pathIcon[pathTarget] || <Error />}{' '}
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {' '}
                {last &&
                  t(
                    isCorrectPathName(pathTarget)
                      ? allSettingsRoute[pathTarget] || pathTarget
                      : 'error'
                  )}
              </Typography>
              {last && <ArrowDropDown />}
            </Box>
          );
        })}
      </Breadcrumbs>
    </HoveringNav>
  );
};
