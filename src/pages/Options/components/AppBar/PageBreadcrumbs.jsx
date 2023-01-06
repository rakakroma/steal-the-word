import { styled, useTheme } from '@mui/material/styles';
import {
  Breadcrumbs,
  Divider,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  tooltipClasses,
  Typography,
} from '@mui/material';
import { CollectionsBookmark, Home, Settings } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from 'react';

const FloatingNavList = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    placement="bottom-start"
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: '180px',
    backgroundColor: '#f5f5f9',
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    border: '1px solid #dadde9',
    // padding: theme.spacing(1),
    padding: '1px',
    cursor: 'pointer',
  },
}));

const HoveringNav = ({ children, currentPathName, pathIcon }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    handleClose();
  }, [currentPathName]);
  const allPath = ['home', 'settings', 'words'];

  const ListLinkButton = ({
    targetPathName,
    currentPathName,
    disableDivider,
  }) => {
    const pathHref =
      targetPathName === 'home' ? '#/home' : `#/home/${targetPathName}`;

    const isCurrentPath = currentPathName === targetPathName;
    return (
      <ListItem
        disablePadding
        sx={{ backgroundColor: isCurrentPath ? 'primary.light' : '' }}
      >
        <ListItemButton href={pathHref} divider={!disableDivider}>
          <ListItemIcon>{pathIcon[targetPathName]}</ListItemIcon>
          <ListItemText primary={targetPathName} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <FloatingNavList
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      title={
        <React.Fragment>
          <List component="nav" disablePadding>
            {allPath.map((oneOfAllPathName, i) => (
              <React.Fragment key={oneOfAllPathName}>
                <ListLinkButton
                  targetPathName={oneOfAllPathName}
                  currentPathName={currentPathName}
                  disableDivider={i === allPath.length - 1}
                />
              </React.Fragment>
            ))}
          </List>
        </React.Fragment>
      }
    >
      {children}
    </FloatingNavList>
  );
};

export const PageBreadcrumbs = () => {
  const { pathname } = useLocation();

  const pathArray = pathname.split('/').slice(1);
  const theme = useTheme();

  const pathIcon = {
    home: <HomeIcon />,
    settings: <Settings />,
    words: <CollectionsBookmark />,
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
        }}
      >
        {pathArray.map((pathTarget, index) => {
          const last = index === pathArray.length - 1;
          const to = `/${pathArray.slice(0, index + 1).join('/')}`;
          return (
            <Typography color="text.primary" key={to}>
              {pathIcon[pathTarget] || null} {last && pathTarget}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </HoveringNav>
  );
};
