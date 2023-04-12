import { SearchOutlined } from '@mui/icons-material';
import { Box, ButtonBase, Typography, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';
import { useKBar } from 'kbar';
import React, { useEffect, useState } from 'react';
import { PageBreadcrumbs } from './PageBreadcrumbs';
import { useTranslation } from 'react-i18next';

const useUserAgentIsMacOS = () => {
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf('Mac OS X') !== -1) setIsMacOS(true);
  }, []);
  return isMacOS;
};
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
        marginLeft: 'auto',
        marginRight: '3px',
        padding: '0px 8px',
        borderRadius: '5px',
        color: 'palette.primary.light',
      }}
    >
      {keyContent}
    </Box>
  );
};

const SearchSection = () => {
  const theme = useTheme();
  const isMacOS = useUserAgentIsMacOS();

  const { query } = useKBar();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const { t } = useTranslation();
  return (
    <ButtonBase
      sx={{
        marginLeft: 'auto',
        minWidth: '95px',
        maxWidth: '350px',
        padding: '3px',
        display: 'flex',
        flexGrow: matches ? 1 : 0,
        alignItems: 'center',
      }}
      onClick={query.toggle}
    >
      <Box
        sx={{
          borderRadius: '8px',
          padding: '3px',
          backgroundColor: 'white',
          width: '100%',
          height: '30px',
          display: 'flex',
          color: 'gray',
          '&:hover': {
            outline: '1px solid gray',
          },
        }}
      >
        <SearchOutlined sx={{ color: 'palette.primary.light' }} />
        {matches && (
          <Typography
            sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {t('Search / Navigation')}
          </Typography>
        )}
        <ShortCutKey keyContent={isMacOS ? 'cmd+k' : 'ctrl+k'} />
      </Box>
    </ButtonBase>
  );
};

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
