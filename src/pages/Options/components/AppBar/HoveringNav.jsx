import { styled } from '@mui/material/styles';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
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
export const HoveringNav = ({ children, currentPathName, pathIcon }) => {
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
  const allPath = ['home', 'settings', 'collection'];

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
        <ListItemButton
          href={pathHref}
          divider={!disableDivider}
          disabled={isCurrentPath}
        >
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
        <Fragment>
          <List component="nav" disablePadding>
            {allPath.map((oneOfAllPathName, i) => (
              <Fragment key={oneOfAllPathName}>
                <ListLinkButton
                  targetPathName={oneOfAllPathName}
                  currentPathName={currentPathName}
                  disableDivider={i === allPath.length - 1}
                />
              </Fragment>
            ))}
          </List>
        </Fragment>
      }
    >
      {children}
    </FloatingNavList>
  );
};
