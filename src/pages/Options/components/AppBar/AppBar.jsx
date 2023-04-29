import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import React from 'react';
import { PageBreadcrumbs } from './PageBreadcrumbs';
import { SearchSection } from './SearchSection';

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

// const DarkModeButton = () => {
//   const theme = useTheme();
//   const { toggleDarkMode } = useContext(ColorModeContext);
//   return (
//     <IconButton onClick={toggleDarkMode}>
//       {theme.palette.mode === 'dark' ? <LightMode /> : <ModeNight />}
//     </IconButton>
//   );
// };

export const AppBar = ({ open, drawerWidth }) => {
  return (
    <StyledAppBar position="sticky" open={open} drawerWidth={drawerWidth}>
      <Toolbar>
        <img
          src={chrome.runtime.getURL('transparent-thief.png')}
          alt="logo of a thief"
          style={{ width: '39px', height: '39px', flexGrow: 0 }}
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
