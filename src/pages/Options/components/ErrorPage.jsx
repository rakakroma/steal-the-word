import { Box, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '600px',
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography sx={{ m: 5 }} variant="h3">
          🚧 no such page 🚧
        </Typography>
        <Typography variant="h6">
          Let's go back to{' '}
          <Link component={RouterLink} to="/home">
            {t('home')} 🏠
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
