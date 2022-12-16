import { Box, Typography, IconButton, useTheme } from '@mui/material';
import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export const DateArrangementPicker = ({
  allArrangementMode,
  setDateArrangement,
  dateArrangement,
}) => {
  const handleUpdateDateArrangement = (position) => {
    const currentModePosition = allArrangementMode.indexOf(dateArrangement);
    if (position === 'forward') {
      if (currentModePosition === allArrangementMode.length - 1) {
        setDateArrangement(allArrangementMode[0]);
        return;
      }
      setDateArrangement(allArrangementMode[currentModePosition + 1]);
      return;
    }
    if (position === 'backward') {
      if (currentModePosition === 0) {
        setDateArrangement(allArrangementMode[allArrangementMode.length - 1]);
        return;
      }
      setDateArrangement(allArrangementMode[currentModePosition - 1]);
    }
  };

  const DirectionButton = ({ direction }) => {
    return (
      <IconButton
        onClick={() => {
          handleUpdateDateArrangement(direction);
        }}
        sx={{
          width: 20,
          height: 20,
          fontSize: '1.7rem',
        }}
      >
        {direction === 'forward' ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    );
  };
  const theme = useTheme();

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', marginX: theme.spacing(2) }}
    >
      <DirectionButton direction="backward" />
      <Typography
        variant="h6"
        sx={{ width: 60, textAlign: 'center', textTransform: 'capitalize' }}
      >
        {dateArrangement}
      </Typography>
      <DirectionButton direction="forward" />
    </Box>
  );
};
