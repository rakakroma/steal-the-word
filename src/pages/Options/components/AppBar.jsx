import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useKBar } from 'kbar';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

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
      }}
      onClick={query.toggle}
    >
      <ShortCutKey keyContent="⌘k" />
      <SearchOutlined sx={{ color: 'black' }} />
    </ButtonBase>
  );
};

const PageBreadcrumbs = () => {
  const { pathname } = useLocation();

  const pathArray = pathname.split('/').slice(1);
  const theme = useTheme();

  const pathIcon = {
    home: <HomeIcon />,
  };

  return (
    <Breadcrumbs sx={{ marginX: theme.spacing(2), alignItems: 'normal' }}>
      {pathArray.map((pathTarget, index) => {
        const last = index === pathArray.length - 1;
        const to = `/${pathArray.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {pathTarget}
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
            {/* {pathTarget} */}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export const AppBar = ({ open, drawerWidth }) => {
  return (
    <StyledAppBar position="sticky" open={open} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          edge="end"
          // onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <PageBreadcrumbs />
        <SearchSection />
      </Toolbar>
    </StyledAppBar>
  );
};
