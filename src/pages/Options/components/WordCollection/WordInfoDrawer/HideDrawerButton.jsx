import { ChevronRight, KeyboardArrowDown } from '@mui/icons-material';
import { IconButton, useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import { WordInfoDrawerContext } from '../../../Options';

export const HideDrawerButton = () => {
  const breakpointOfDirectionChange = useMediaQuery('(min-width:700px)');

  const { changeWordInfoTarget } = useContext(WordInfoDrawerContext);

  const handleDrawerClose = () => {
    // setOpen(false);
    changeWordInfoTarget(null);
  };

  return (
    <IconButton sx={{ width: '30px' }} onClick={handleDrawerClose}>
      {breakpointOfDirectionChange ? <ChevronRight /> : <KeyboardArrowDown />}
    </IconButton>
  );
};
