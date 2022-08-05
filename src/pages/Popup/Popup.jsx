import { Link, Switch, ToggleButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {

  const [renderWhenNewElementAppear, setRenderWhenNewElementAppear] = useState(false)
  const [turnOnOff, setTurnOnOff] = useState(true)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const thisDomain = tabs[0].url.split("//")[1].split('/')[0];

      chrome.storage.local.get(['whiteDomainList', 'onOff'], (obj) => {
        if (obj.onOff === true || obj.onOff === false) {
          setTurnOnOff(obj.onOff)
        }
        const whiteList = obj.whiteDomainList;
        if (Array.isArray(whiteList) && whiteList.includes(thisDomain)) {
          setRenderWhenNewElementAppear(true)
        }
      })
    })
  }, [])


  const handleRenderOption = () => {
    if (!renderWhenNewElementAppear) {
      setRenderWhenNewElementAppear(true);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: true, tabInfo: tabs[0] }, (response) => {
          console.log(response);
        });
      });
    } else {
      setRenderWhenNewElementAppear(false);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: false, tabInfo: tabs[0] }, (response) => {
          console.log(response);
        });
      });
    }
  }


  const handleTurnOnOff = () => {
    if (turnOnOff === true) {
      setTurnOnOff(false)
      chrome.storage.local.set({ "onOff": false })

      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   chrome.tabs.sendMessage(tabs[0].id, { onOff: false }, (response) => {
      //     console.log(response);
      //   });
      // });

    } else {
      setTurnOnOff(true)
      chrome.storage.local.set({ "onOff": true })
      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   chrome.tabs.sendMessage(tabs[0].id, { onOff: true }, (response) => {
      //     console.log(response);
      //   });
      // });
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={handleToWordList}>單字清單</button> */}
        <Link href={chrome.runtime.getURL('options.html')} target="_blank" underline='none'>
          單字清單
        </Link>
        動態更新
        <Switch size='small'
          checked={renderWhenNewElementAppear}
          onChange={handleRenderOption} />
        關閉功能
        <Switch size='small'
          checked={turnOnOff}
          onChange={handleTurnOnOff} />

        <h1>パップアップ</h1>
        {/* <h1><ruby>Hooli<rt>予你</rt>Ruby</ruby></h1> */}
      </header>
    </div>
  );
};

export default Popup;
