import { ChevronRight, KeyboardArrowDown } from '@mui/icons-material';
import { IconButton, useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import { WordInfoDrawerContext } from '../../../Options';
import { drawerDirectionBreakpoint } from './WordInfoDrawer';
import { useTheme } from '@emotion/react';

export const HideDrawerButton = () => {
  const theme = useTheme();
  const matches = useMediaQuery(
    theme.breakpoints.up(drawerDirectionBreakpoint)
  );

  const { changeWordInfoTarget } = useContext(WordInfoDrawerContext);

  const handleDrawerClose = () => {
    changeWordInfoTarget(null);
  };

  return (
    <IconButton sx={{ width: '30px' }} onClick={handleDrawerClose}>
      {matches ? <ChevronRight /> : <KeyboardArrowDown />}
    </IconButton>
  );
};
