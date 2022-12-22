import { Home, Settings } from '@mui/icons-material';
import { Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HomeIcon } from '@spectrum-web-components/icons-workflow';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const StyledSideBar = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'block',
  },
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
  width: '60px',
  height: '100vh',
  padding: '20px 20px',
  boxShadow: '0 0 6px hsl(210 14% 90%)',
  backgroundColor: theme.palette.background.light,
}));

export const Sidebar = () => {
  return (
    <StyledSideBar>
      <Link component={RouterLink} to="/">
        <Settings />
      </Link>
      <br />
      <Link component={RouterLink} to="home">
        <Home />
      </Link>
    </StyledSideBar>
  );
};
