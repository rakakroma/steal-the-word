import { Box, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();

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
          🚧 {error.status} Error 🚧
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', my: 2 }}>
          {error.data}
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
