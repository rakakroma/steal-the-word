import { Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const StyledSideBar = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '100vh',
  minWidth: '50px',
  padding: '20px 20px',
  boxShadow: '0 0 6px hsl(210 14% 90%)',
  backgroundColor: theme.palette.background.light,
}));

export const Sidebar = () => {
  return (
    <StyledSideBar>
      <Link component={RouterLink} to="/">
        home
      </Link>
      <br />
      <Link component={RouterLink} to="main">
        main
      </Link>
    </StyledSideBar>
  );
};
