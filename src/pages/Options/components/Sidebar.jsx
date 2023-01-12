import { CollectionsBookmark, Home, Settings } from '@mui/icons-material';
import { Box, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HomeIcon } from '@spectrum-web-components/icons-workflow';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const StyledSideBar = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'block',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  // width: '60px',
  height: '100vh',
  padding: '20px 20px',
  boxShadow: '0 0 6px hsl(210 14% 90%)',
  backgroundColor: theme.palette.background.light,
}));

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [sidebarWidth, setSideBarWidth] = useState(60);

  useEffect(() => {
    console.log(pathname);
    if (pathname?.endsWith('home')) {
      setSideBarWidth(180);
    } else {
      setSideBarWidth(60);
    }
  }, [pathname]);

  return (
    <StyledSideBar sx={{ width: `${sidebarWidth}px` }}>
      <Stack>
        <Link component={RouterLink} to="home">
          <Home /> Home
        </Link>
        <Link component={RouterLink} to="/">
          <Settings /> Settings
        </Link>
        <Link component={RouterLink} to="home/collection">
          <CollectionsBookmark /> Collections
        </Link>
      </Stack>
    </StyledSideBar>
  );
};
