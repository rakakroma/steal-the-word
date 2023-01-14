// import { TabPanel } from '@mui/lab';
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import { ApiInfo } from './ApiInfo';
import { ImportAndExportBox } from './backupRestore/ImportAndExportBox';
import { OtherInfo } from './OtherInfo';
import { StylingBox } from './StylingBox';

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
        <Tabs
          value={tabValue}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Text Styling" />
          <Tab label="Api Settings" />
          <Tab label="Backup / Restore" />
          <Tab label="Info" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5">Style The Marked Text</Typography>
          <PanelContainerBox>
            <StylingBox />
          </PanelContainerBox>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5">Dictionary API</Typography>
          <PanelContainerBox>
            <ApiInfo />
          </PanelContainerBox>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5">Backup / Restore</Typography>
          <PanelContainerBox>
            <ImportAndExportBox />
          </PanelContainerBox>
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5">Info</Typography>
          <PanelContainerBox>
            <OtherInfo />
          </PanelContainerBox>
        </TabPanel>
        {/* <Typography variant="h5">Site Preferences</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
          <SiteDataGrid />
        </Box> */}
      </Paper>
    </Box>
  );
};
