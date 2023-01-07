import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { DirectionButton } from './DirectionButton';

export const DateArrangementPicker = ({
  allArrangementMode,
  setDateArrangement,
  dateArrangement,
}) => {
  const handleUpdateDateArrangement = (isForward) => {
    const currentModePosition = allArrangementMode.indexOf(dateArrangement);
    if (isForward) {
      if (currentModePosition === allArrangementMode.length - 1) {
        setDateArrangement(allArrangementMode[0]);
        return;
      }
      setDateArrangement(allArrangementMode[currentModePosition + 1]);
      return;
    }

    if (currentModePosition === 0) {
      setDateArrangement(allArrangementMode[allArrangementMode.length - 1]);
      return;
    }
    setDateArrangement(allArrangementMode[currentModePosition - 1]);
  };

  const theme = useTheme();

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', marginX: theme.spacing(2) }}
    >
      <DirectionButton
        isForward={false}
        clickHandler={handleUpdateDateArrangement}
      />
      <Typography
        variant="h6"
        sx={{ width: 60, textAlign: 'center', textTransform: 'capitalize' }}
      >
        {dateArrangement}
      </Typography>
      <DirectionButton
        isForward={true}
        clickHandler={handleUpdateDateArrangement}
      />
    </Box>
  );
};
