import { Box, Link, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NoDataPage = () => {
  const imgPath = chrome.runtime.getURL('flame-welcome.png');

  const { t } = useTranslation();

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
        style={{ width: '150px', height: '150px' }}
      />
      <Typography variant="h3">{t(`no-word-yet`)}</Typography>
      <Typography variant="h6">
        {t('add some word and come back to see the changes')} 🤗
      </Typography>
      <Typography>
        {t('no-data-long-before')}{' '}
        <Link href="https://rakakroma.github.io/steal-word-landing-page/">
          Landing Page
        </Link>{' '}
        {t('no-data-long-middle')}{' '}
        <RouterLink to="/home/settings/backup-restore">
          {t('use the demo data in Settings')}
        </RouterLink>
        {t('no-data-long-after')}
      </Typography>
    </Box>
  );
};
