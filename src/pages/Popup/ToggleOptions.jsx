import { Stack, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { db } from '../Background/database.js';

export const AllSitesToggleOptions = ({
  activate,
  setActivate,
  openMouseTool,
  setOpenMouseTool,
  openFloatingWindow,
  setOpenFloatingWindow,
  customSettingToggle,
  domainData,
  setDomainData,
}) => {
  const handleAllSiteOption = (option) => {
    console.log(option);
    switch (option) {
      case 'activate':
        chrome.storage.local.set({ activate: !activate });
        setActivate(!activate);
        break;
      case 'openMouseTool':
        chrome.storage.local.set({ mouseTool: !openMouseTool });
        setOpenMouseTool(!openMouseTool);
        break;
      case 'openFloatingWindow':
        chrome.storage.local.set({ floatingWindow: !openFloatingWindow });
        setOpenFloatingWindow(!openFloatingWindow);
        break;
      default:
    }
  };

  return (
    <Stack>
      <Option
        description="Floating Window"
        checked={openFloatingWindow}
        handleChange={() => handleAllSiteOption('openFloatingWindow')}
        disabled={!activate}
      />
      <Option
        description="Mouse Tool"
        checked={openMouseTool}
        handleChange={() => handleAllSiteOption('openMouseTool')}
        disabled={!activate}
      />

      <Option
        description="Activate"
        checked={activate}
        handleChange={() => handleAllSiteOption('activate')}
      />
    </Stack>
  );
};

export const CurrentSiteToggleOptions = ({
  domainData,
  currentDomain,
  activate,
  openMouseTool,
  openFloatingWindow,
  setDomainData,
  customSettingToggle,
  setCustomSettingToggle,
}) => {
  const [openCurrentSiteFloatingWindow, setOpenCurrentSiteFloatingWindow] =
    useState(false);
  const [openCurrentSiteMouseTool, setOpenCurrentSiteMouseTool] =
    useState(false);
  const [currentSiteActivateToggle, setCurrentSiteActivateToggle] =
    useState(false);

  useEffect(() => {
    if (domainData && typeof domainData.activate === 'boolean') {
      setOpenCurrentSiteFloatingWindow(domainData.floatingWindow);
      setOpenCurrentSiteMouseTool(domainData.mouseTool);
      setCurrentSiteActivateToggle(domainData.activate);
      return;
    }
    setOpenCurrentSiteFloatingWindow(openFloatingWindow);
    setOpenCurrentSiteMouseTool(openMouseTool);
    setCurrentSiteActivateToggle(activate);
  }, [domainData, openMouseTool, openFloatingWindow, activate]);

  const handleCurrentSiteOptionChange = async (option) => {
    switch (option) {
      case 'customSettingToggle':
        if (!domainData) {
          const domainObj = {
            url: currentDomain,
            activate: true,
            floatingWindow: openFloatingWindow,
            mouseTool: openMouseTool,
            icon: null,
            tags: null,
            lang: null,
          };
          db.domainAndLink
            .add(domainObj)
            .then(() => {
              setDomainData(domainObj);
              setOpenCurrentSiteFloatingWindow(domainData.floatingWindow);
              setOpenCurrentSiteMouseTool(domainData.mouseTool);
              setCurrentSiteActivateToggle(domainData.activate);
              setCustomSettingToggle(!customSettingToggle);
            })
            .catch((err) => console.error(err));
        }

        if (customSettingToggle === true) {
          db.domainAndLink
            .update(domainData, {
              floatingWindow: null,
              activate: null,
              mouseTool: null,
            })
            .then(() => {
              setDomainData({
                ...domainData,
                floatingWindow: null,
                activate: null,
                mouseTool: null,
              });
              setOpenCurrentSiteFloatingWindow(openFloatingWindow);
              setOpenCurrentSiteMouseTool(openMouseTool);
              setCurrentSiteActivateToggle(activate);
              setCustomSettingToggle(!customSettingToggle);
            });
        } else {
          db.domainAndLink
            .update(domainData, {
              floatingWindow: openFloatingWindow,
              activate: true,
              mouseTool: openMouseTool,
            })
            .then(() => {
              setDomainData({
                ...domainData,
                floatingWindow: openFloatingWindow,
                activate: true,
                mouseTool: openMouseTool,
              });
              setCurrentSiteActivateToggle(true);
              setOpenCurrentSiteFloatingWindow(openFloatingWindow);
              setOpenCurrentSiteMouseTool(openMouseTool);
              setCustomSettingToggle(!customSettingToggle);
            });
        }

        break;
      case 'openCurrentSiteFloatingWindow':
        db.transaction('rw', db.domainAndLink, async () => {
          if (domainData.floatingWindow === false) {
            await db.domainAndLink.update(domainData, { floatingWindow: true });
            setDomainData({ ...domainData, floatingWindow: true });
            setOpenCurrentSiteFloatingWindow(true);
          } else {
            await db.domainAndLink.update(domainData, {
              floatingWindow: false,
            });
            setDomainData({ ...domainData, floatingWindow: false });
            setOpenCurrentSiteFloatingWindow(false);
          }
        });
        break;
      case 'openCurrentSiteMouseTool':
        db.transaction('rw', db.domainAndLink, async () => {
          if (domainData.mouseTool === false) {
            await db.domainAndLink.update(domainData, { mouseTool: true });
            setDomainData({ ...domainData, mouseTool: true });
            setOpenCurrentSiteMouseTool(true);
          } else {
            await db.domainAndLink.update(domainData, { mouseTool: false });
            setDomainData({ ...domainData, mouseTool: false });
            setOpenCurrentSiteMouseTool(false);
          }
        });
        break;
      case 'currentSiteActivateToggle':
        db.transaction('rw', db.domainAndLink, async () => {
          if (domainData.activate === true) {
            await db.domainAndLink.update(domainData, {
              floatingWindow: false,
              activate: false,
              mouseTool: false,
            });
            const data = await db.domainAndLink.get({ url: currentDomain });
            console.log(data || 'no data');
            console.log('data in db');

            setDomainData({
              ...domainData,
              floatingWindow: false,
              activate: false,
              mouseTool: false,
            });
            setCurrentSiteActivateToggle(false);
            setOpenCurrentSiteFloatingWindow(false);
            setOpenCurrentSiteMouseTool(false);
          } else {
            await db.domainAndLink.update(domainData, { activate: true });
            setDomainData({
              ...domainData,
              floatingWindow: openFloatingWindow,
              activate: true,
              mouseTool: openMouseTool,
            });
            setCurrentSiteActivateToggle(true);
            setOpenCurrentSiteFloatingWindow(openFloatingWindow);
            setOpenCurrentSiteMouseTool(openMouseTool);
          }
        }).then();
        break;
      default:
    }
  };

  return (
    <Stack>
      <Option
        description="Use Custom Setting in Current Site?"
        checked={customSettingToggle}
        handleChange={() =>
          handleCurrentSiteOptionChange('customSettingToggle')
        }
        disabled={!activate}
      />
      <Option
        description="Floating Window"
        checked={openCurrentSiteFloatingWindow}
        handleChange={() =>
          handleCurrentSiteOptionChange('openCurrentSiteFloatingWindow')
        }
        disabled={
          !customSettingToggle ||
          !activate ||
          !openFloatingWindow ||
          !domainData.activate
        }
      />
      <Option
        description="Mouse Tool"
        checked={openCurrentSiteMouseTool}
        handleChange={() =>
          handleCurrentSiteOptionChange('openCurrentSiteMouseTool')
        }
        disabled={
          !customSettingToggle ||
          !activate ||
          !openMouseTool ||
          !domainData.activate
        }
      />
      <Option
        description="Activate"
        checked={currentSiteActivateToggle}
        handleChange={() =>
          handleCurrentSiteOptionChange('currentSiteActivateToggle')
        }
        disabled={!customSettingToggle || !activate}
      />
    </Stack>
  );
};

const Option = ({ description, checked, handleChange, disabled }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">{description}</Typography>

      <Switch checked={checked} onChange={handleChange} disabled={disabled} />
    </Box>
  );
};
