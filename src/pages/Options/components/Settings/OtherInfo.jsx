import { Box, Typography } from '@mui/material';
import React from 'react';

export const OtherInfo = () => {
  return (
    <Box flex>
      <Box>
        <Typography>
          Hi, I am Rakak. This is my first project. I hope it works well. You
          can submit the form if you want to report any bugs/issues or have any
          advices.
        </Typography>
        <Typography></Typography>
      </Box>
      <Box>
        <img
          src={chrome.runtime.getURL('transparent-thief.png')}
          alt="logo of a thief"
          style={{ width: '250px', height: '250px' }}
        />
      </Box>
    </Box>
  );
};
