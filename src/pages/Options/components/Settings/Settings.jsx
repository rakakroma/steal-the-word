import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { ApiInfo } from './ApiInfo';
import { ImportAndExportBox } from './backupRestore/ImportAndExportBox';
import { OtherInfo } from './OtherInfo';
import { StylingBox } from './StylingBox';
import { useTranslation } from 'react-i18next';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PanelContainerBox = styled(Box)(({ theme }) =>
  theme.unstable_sx({
    display: 'flex',
    justifyContent: 'center',
    p: 5,
  })
);
export const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { t } = useTranslation();

  const tabInfo = {
    'Text Styling': <StylingBox />,
    'Language / Api Settings': <ApiInfo />,
    'Backup / Restore': <ImportAndExportBox />,
    'About / Contact': <OtherInfo />,
  };

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
        <Tabs
          value={tabValue}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(tabInfo).map((title) => (
            <Tab key={title} label={t(title)} />
          ))}
        </Tabs>

        {Object.entries(tabInfo).map(([title, component], index) => {
          return (
            <TabPanel value={tabValue} index={index} key={title}>
              <Typography variant="h5">{t(title)}</Typography>
              <PanelContainerBox>{component}</PanelContainerBox>
            </TabPanel>
          );
        })}

        {/* <Typography variant="h5">Site Preferences</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
          <SiteDataGrid />
        </Box> */}
      </Paper>
    </Box>
  );
};
