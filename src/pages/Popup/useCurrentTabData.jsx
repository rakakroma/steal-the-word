import { useEffect, useState } from 'react';
import {
  checkIsValidEnvironmentByUrl,
  getCurrentDomain,
} from '../../utilsForAll/checkUrl';

export const useCurrentTabData = () => {
  const [tabData, setTabData] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTabData(tabs[0]);
    });
  }, []);

  if (!tabData) {
    return { noTabData: true };
  }

  if (tabData) {
    const currentUrl = tabData.url;
    const currentDomain = getCurrentDomain(currentUrl);
    const validPlace = checkIsValidEnvironmentByUrl(currentUrl);
    const favIconUrl = currentDomain === 'file' ? '' : tabData.favIconUrl;
    return { currentUrl, currentDomain, favIconUrl, validPlace };
  }
};
