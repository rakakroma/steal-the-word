import {
  ArrowDropDown,
  CollectionsBookmark,
  Settings,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { Breadcrumbs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { HoveringNav } from './HoveringNav';

export const PageBreadcrumbs = () => {
  const { pathname } = useLocation();

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
          marginX: theme.spacing(2),
          alignItems: 'normal',
          cursor: 'default',
        }}
      >
        {pathArray.map((pathTarget, index) => {
          const last = index === pathArray.length - 1;
          return (
            <Typography color="text.primary" key={pathTarget}>
              {pathIcon[pathTarget] || null} {last && pathTarget}
              {last && <ArrowDropDown />}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </HoveringNav>
  );
};
