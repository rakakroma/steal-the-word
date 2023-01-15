import { GitHub } from '@mui/icons-material';
import { Box, FormLabel, Typography } from '@mui/material';
import React from 'react';
import { ReportForm } from './ReportForm';

export const OtherInfo = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ my: 'auto' }}>
          <Typography variant="subtitle1">
            Hi, <b>Steal the Word</b> is my first personal project. Though there
            are some known issues that I have no idea how to fix, I hope it
            works well in most use cases. Feel free to report bugs/issues by
            submit the form below (to my google sheet) or open an issue/ pull
            request on github.
          </Typography>

          <Typography
            component="a"
            target="_blank"
            href="https://github.com/rakakroma/steal-the-word"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              backgroundColor: '#f8f8f8',
            }}
          >
            <GitHub fontSize="small" />
            steal-the-word by rakakroma
          </Typography>
        </Box>
        <Box sx={{ width: '200px', mx: 'auto' }}>
          <img
            src={chrome.runtime.getURL('transparent-thief.png')}
            alt="logo of a thief"
            style={{
              width: '190px',
              height: '200px',
              objectFit: 'cover',
              objectPosition: '113%',
            }}
          />
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            By Stable Diffusion 2.1 Demo (And I remove its background)
          </Typography>
        </Box>
      </Box>
      <ReportForm />
    </Box>
  );
};
