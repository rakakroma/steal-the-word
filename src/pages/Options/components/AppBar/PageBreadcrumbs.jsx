import {
  ArrowDropDown,
  CollectionsBookmark,
  Settings,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Breadcrumbs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { HoveringNav } from './HoveringNav';
import { useTranslation } from 'react-i18next';

export const PageBreadcrumbs = () => {
  const { pathname } = useLocation();

  const { t } = useTranslation();

  const pathArray = pathname.split('/').slice(1);
  const theme = useTheme();

  const pathIcon = {
    home: <HomeIcon />,
    settings: <Settings />,
    collection: <CollectionsBookmark />,
  };

  return (
    <HoveringNav
      pathIcon={pathIcon}
      currentPathName={pathArray[pathArray.length - 1]}
    >
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
          return (
            <Box
              sx={{ display: 'flex', wordBreak: 'keep-all' }}
              color="text.primary"
              key={pathTarget}
            >
              {pathIcon[pathTarget] || null} {last && t(pathTarget)}
              {last && <ArrowDropDown />}
            </Box>
          );
        })}
      </Breadcrumbs>
    </HoveringNav>
  );
};
