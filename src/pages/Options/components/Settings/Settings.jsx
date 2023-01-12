import { Box, Divider, Paper, Typography } from '@mui/material';
import React from 'react';
import { ApiInfo } from './ApiInfo';
import { ImportAndExportBox } from './backupRestore/ImportAndExportBox';
import { StylingBox } from './StylingBox';

export const Settings = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper
        sx={{
          maxWidth: '900px',
          p: 4,
          borderRadius: 1,
          width: 'fill-available',
        }}
        elevation={5}
      >
        <Typography variant="h4">Settings / Preferences</Typography>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h5">Backup / Restore</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
          <ImportAndExportBox />
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h5">Style The Marked Text</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
          <StylingBox />
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="h5">API/AutoSearch</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
          <ApiInfo />
        </Box>
      </Paper>
    </Box>
  );
};
