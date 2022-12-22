import { useTheme } from '@mui/material/styles';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { CollectionsBookmark } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';


// const NavList = ()=>{

// }

export const PageBreadcrumbs = () => {
  const { pathname } = useLocation();

  const pathArray = pathname.split('/').slice(1);
  const theme = useTheme();

  const pathIcon = {
    home: <HomeIcon />,
    words: <CollectionsBookmark />,
  };

  return (
    <Breadcrumbs sx={{ marginX: theme.spacing(2), alignItems: 'normal' }}>
      {pathArray.map((pathTarget, index) => {
        const last = index === pathArray.length - 1;
        const to = `/${pathArray.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {pathIcon[pathTarget] || null} {pathTarget}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
            {pathIcon[pathTarget] || pathTarget}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
