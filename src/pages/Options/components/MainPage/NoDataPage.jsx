import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const NoDataPage = () => {
  const imgPath = chrome.runtime.getURL('flame-welcome.png');
  return (
    <Box
      sx={{
        height: '84vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2">
        Illustration by{' '}
        <Link href="https://icons8.com/illustrations/author/oZpGJx8ts63Q">
          Thierry Fousse
        </Link>{' '}
        from <Link href="https://icons8.com/illustrations">Ouch!</Link>
      </Typography>
      <img
        src={imgPath}
        alt="welcome"
        style={{ width: '300px', height: '300px' }}
      />
      <Typography variant="h3">You Haven't add any data yet</Typography>
      <Typography variant="h6">
        add some word and come back to see the changes 🤗
      </Typography>
      <Typography>
        If you don't know how to do, please visit the{' '}
        <Link href="https://rakakroma.github.io/steal-word-landing-page/">
          Landing Page
        </Link>
        , or <Button variant="outlined">use the demo data</Button>
      </Typography>
    </Box>
  );
};
