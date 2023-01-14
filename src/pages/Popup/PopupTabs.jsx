// import TabUnstyled from '@mui/base/TabUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabUnstyled';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/system';
import React, { useContext, useState } from 'react';
import { TabDataContext } from './Popup';
import {
  AllSitesToggleOptions,
  CurrentSiteToggleOptions,
} from './ToggleOptions';
import { useDbDomainData, useLocalStorageData } from './useDataHook';

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
  const { currentDomain, validPlace } = useContext(TabDataContext);
  const domainDataAndMethods = useDbDomainData(currentDomain);
  const localStorageDataAndMethods = useLocalStorageData();

  const { isCustomSetting } = domainDataAndMethods;
  const { globalPreference } = localStorageDataAndMethods;

  if (isCustomSetting && globalPreference.activate && validPlace) {
    setCurrentTab(0);
  }

  const handleChange = (e, value) => {
    if (!validPlace || !globalPreference.activate) return;
    setCurrentTab(value);
  };
  return (
    <Tabs value={currentTab} onChange={handleChange}>
      <TabsList>
        {globalPreference.activate && validPlace && (
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
