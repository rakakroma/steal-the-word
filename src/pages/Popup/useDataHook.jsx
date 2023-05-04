import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect, useState } from 'react';
import { db } from '../Background/database';

const allSettingName = ['activate', 'floatingWindow', 'mouseTool'];
const allKeySetToValue = (value, keyArray) =>
  Object.fromEntries(keyArray.map((name) => [name, value]));

export const useDbDomainData = (domainUrl) => {
  const domainData = useLiveQuery(() =>
    db['domainAndLink'].get({
      url: domainUrl,
    })
  );

  const newDomainData = {
    url: domainUrl,
    customRule: false,
    activate: true,
    floatingWindow: true,
    mouseTool: true,
    icon: null,
    tags: null,
    lang: null,
  };

  console.log(domainData || 'no domain data');

  const addNewDomain = () => {
    if (domainData) {
      console.error('we already got domain data here');
      return;
    }
    if (!domainUrl) {
      console.error('this is not a valid domain url');
      return;
    }

    db['domainAndLink'].add(newDomainData);
  };

  const updateDataInDb = (newValueObj) => {
    if (!domainData) {
      addNewDomain(newValueObj);
      return;
    }
    db['domainAndLink'].update(domainData.id, newValueObj);
  };

  const toggleOneDomainData = (key) => {
    if (!domainUrl) return;
    if (!domainData && domainUrl) {
      addNewDomain();
    }
    updateDataInDb({ [key]: !domainData[key] });
  };

  return {
    domainData: domainData || newDomainData, //use template domain data if no domain data
    toggleOneDomainData,
  };
};

export const useLocalStorageData = () => {
  const [localData, setLocalData] = useState(
    allKeySetToValue(true, allSettingName)
  );

  useEffect(() => {
    chrome.storage.local.get(allSettingName, (obj) => {
      setLocalData(obj);
    });
  }, []);

  const toggleData = (target) => {
    if (!allSettingName.includes(target)) return;
    const newState = { [target]: !localData[target] };
    chrome.storage.local.set(newState);
    setLocalData({ ...localData, [target]: newState[target] });
  };

  return { globalPreference: localData, toggleGlobalPreference: toggleData };
};
