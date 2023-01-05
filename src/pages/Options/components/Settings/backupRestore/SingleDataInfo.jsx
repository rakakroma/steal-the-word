import { Box, Typography } from '@mui/material';
import React from 'react';

export const SingleDataInfo = ({ title, number }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: 1,
        // backgroundColor: blue[50],
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1">{`${number || 0}`}</Typography>
    </Box>
  );
};
