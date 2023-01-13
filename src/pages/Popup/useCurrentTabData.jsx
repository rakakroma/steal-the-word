import { useEffect, useState } from 'react';

export const useCurrentTabData = () => {
  const [tabData, setTabData] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTabData(tabs[0]);
    });
  }, []);

  let currentUrl;
  let currentDomain;
  let favIconUrl;
  let validPlace;

  if (tabData) {
    currentUrl = tabData.url;
    currentDomain = new URL(tabData.url).hostname;
    favIconUrl = tabData.favIconUrl;
    validPlace = !tabData.url.split('//')[0].includes('extension');
  }
  return { currentUrl, currentDomain, favIconUrl, validPlace };
};
