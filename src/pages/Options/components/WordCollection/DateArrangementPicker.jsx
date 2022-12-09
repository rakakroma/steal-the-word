import { Box, Typography, IconButton, useTheme } from '@mui/material';
import React from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export const DateArrangementPicker = ({
  handleUpdateDateArrangement,
  dateArrangement,
}) => {
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
