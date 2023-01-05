// import TabUnstyled from '@mui/base/TabUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';

import TabsListUnstyled from '@mui/base/TabUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { styled } from '@mui/system';
import {
  AllSitesToggleOptions,
  CurrentSiteToggleOptions,
  ToggleOptions,
} from './ToggleOptions';
import { TabDataContext } from './Popup';
import { useDbDomainData, useLocalStorageData } from './useDataHook';
import { blue } from '@mui/material/colors';

const TabsList = styled(TabsListUnstyled)`
  width: 220px;
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  border: 0px;
`;

const Tab = styled(TabUnstyled)`
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 2px;
  margin: 2px 2px;
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Tabs = styled(TabsUnstyled)`
  width: 100%;
  margin: 0;
  padding: 2px;
`;

export const PopupTabs = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const { currentDomain } = useContext(TabDataContext);
  const domainDataAndMethods = useDbDomainData(currentDomain);
  const localStorageDataAndMethods = useLocalStorageData();

  const { isCustomSetting } = domainDataAndMethods;
  const { globalPreference } = localStorageDataAndMethods;

  // if (isCustomSetting) {
  //   setCurrentTab(0);
  // }

  const handleChange = (value) => {
    setCurrentTab(value);
  };
  return (
    <Tabs value={currentTab} onChange={(e, value) => handleChange(value)}>
      <TabsList>
        {globalPreference.activate && (
          <Tab component="span" value={0}>
            current Site
          </Tab>
        )}
        <Tab component="span" value={1} disabled={!globalPreference.activate}>
          All Sites
        </Tab>
      </TabsList>
      <TabPanelUnstyled value={0}>
        <CurrentSiteToggleOptions
          domainDataAndMethods={domainDataAndMethods}
          localStorageDataAndMethods={localStorageDataAndMethods}
        />
      </TabPanelUnstyled>
      <TabPanelUnstyled value={1}>
        <AllSitesToggleOptions
          localStorageDataAndMethods={localStorageDataAndMethods}
        />
      </TabPanelUnstyled>
    </Tabs>
  );
};
