import { LightMode, ModeNight, SearchOutlined } from '@mui/icons-material';
import { Box, ButtonBase, IconButton } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useKBar } from 'kbar';
import React, { useContext } from 'react';
import { ColorModeContext } from '../../Options';
import { PageBreadcrumbs } from './PageBreadcrumbs';

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => !['open', 'drawerWidth'].includes(prop),
})(({ theme, open, drawerWidth }) => ({
  boxShadow: 'unset',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: '100%',
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ShortCutKey = ({ keyContent }) => {
  return (
    <Box
      sx={{
        fontSize: '0.75rem',
        fontWeight: '700',
        lineHeight: '20px',
        marginLeft: '5px',
        border: '1px solid rgb(30, 73, 118)',
        padding: '0px 8px',
        borderRadius: '5px',
        color: 'black',
      }}
    >
      {keyContent}
    </Box>
  );
};

const SearchSection = () => {
  const { query } = useKBar();

  return (
    <ButtonBase
      sx={{
        borderRadius: '8px',
        minWidth: '95px',
        width: '100px',
        display: 'flex',
        // flexDirection: 'row-reverse',
        padding: '3px',
        '&:hover': {
          backgroundColor: '#e6e6e6',
        },
      }}
      onClick={query.toggle}
    >
      <ShortCutKey keyContent="⌘k" />
      <SearchOutlined sx={{ color: 'black' }} />
    </ButtonBase>
  );
};

const DarkModeButton = () => {
  const theme = useTheme();
  const { toggleDarkMode } = useContext(ColorModeContext);
  return (
    <IconButton onClick={toggleDarkMode}>
      {theme.palette.mode === 'dark' ? <LightMode /> : <ModeNight />}
    </IconButton>
  );
};

export const AppBar = ({ open, drawerWidth }) => {
  return (
    <StyledAppBar position="sticky" open={open} drawerWidth={drawerWidth}>
      <Toolbar>
        <img
          src={chrome.runtime.getURL('transparent-thief.png')}
          alt="logo of a thief"
          style={{ width: '25px', height: '25px' }}
        />
        {/* <IconButton
          aria-label="open drawer"
          edge="end"
          // onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <DarkModeButton /> */}
        <PageBreadcrumbs />
        <SearchSection />
      </Toolbar>
    </StyledAppBar>
  );
};
