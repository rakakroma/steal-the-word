import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';

const PanelContainerBox = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    display: 'flex',
    justifyContent: 'center',
    p: 5,
  })
);

export const allSettingsRoute = {
  'text-styling': 'Text Style',
  'lang-api': 'Language / API',
  'backup-restore': 'Backup / Restore',
  about: 'About',
};

const MyTabs = ({ currentPath }) => {
  const { t } = useTranslation();
  return (
    <Tabs
      value={currentPath}
      sx={{ borderRight: 1, borderColor: 'divider' }}
      variant="scrollable"
      scrollButtons="auto"
    >
      {Object.entries(allSettingsRoute).map(([path, label]) => (
        <Tab
          key={path}
          label={t(label)}
          value={path}
          to={path}
          component={Link}
        />
      ))}
    </Tabs>
  );
};

export const Settings = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const pathArray = pathname.split('/');
  const currentPath = Object.keys(allSettingsRoute).includes(
    pathArray[pathArray.length - 1]
  )
    ? pathArray[pathArray.length - 1]
    : 'text-styling';

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
        <Typography variant="h4">{t('Preferences')}</Typography>
        <MyTabs currentPath={currentPath} />
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">
            {t(allSettingsRoute[currentPath])}
          </Typography>
          <PanelContainerBox>
            <Outlet />
          </PanelContainerBox>
        </Box>
      </Paper>
    </Box>
  );
};
