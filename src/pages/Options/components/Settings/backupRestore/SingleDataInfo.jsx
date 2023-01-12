import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

export const SingleDataInfo = ({
  title,
  number,
  deleteDecoration,
  isImportedData,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 1,
        p: 2,
        minWidth: '150px',
        zIndex: 500,
        border: `1px solid ${
          isImportedData ? 'green' : deleteDecoration ? 'red' : 'grey'
        }`,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography
        variant="h4"
        sx={{
          textDecorationLine: deleteDecoration ? 'line-through' : '',
        }}
      >{`${number || 0}`}</Typography>
    </Paper>
  );
};
