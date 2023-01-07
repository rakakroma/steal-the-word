import { IconButton } from '@mui/material';
import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export const DirectionButton = ({ isForward, clickHandler }) => {
  return (
    <IconButton
      onClick={(e) => {
        clickHandler(isForward);
      }}
      sx={{
        width: 20,
        height: 20,
        fontSize: '1.7rem',
      }}
    >
      {isForward ? <ChevronRight /> : <ChevronLeft />}
    </IconButton>
  );
};
