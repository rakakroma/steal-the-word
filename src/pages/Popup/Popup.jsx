import { Link, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {

  const [dynamicRendering, setDynamicRendering] = useState(false)
  const [turnOnOff, setTurnOnOff] = useState(true)
  const [currentDomain, setCurrentDomain] = useState("")
  const [validPlace, setValidPlace] = useState(true)
  const [showWordList, setShowWordList] = useState(false)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const thisDomain = tabs[0].url.split("//")[1].split('/')[0];
      if (tabs[0].url.split("//")[0].includes('extension')) {
        setValidPlace(false)
      }
      setCurrentDomain(thisDomain)

      chrome.storage.local.get(['whiteDomainList', 'onOff', 'wordListDisplay'], (obj) => {
        if (obj.onOff === true || obj.onOff === false) {
          setTurnOnOff(obj.onOff)
        }
        const whiteList = obj.whiteDomainList;
        if (Array.isArray(whiteList) && whiteList.includes(thisDomain)) {
          setDynamicRendering(true)
        }
        if (obj.wordListDisplay === true) {
          setShowWordList(true)
        }
      })
    })
  }, [])

  if (!validPlace) {
    return <div className="App">
      <header className="App-header">
        <h4>擴充程式外才可使用</h4>
        <h2><ruby>hōo lí<rt>予你</rt>Ruby</ruby></h2>
      </header>
    </div>

  }

  const handleRenderOption = () => {
    if (!dynamicRendering) {
      setDynamicRendering(true);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: true, tabInfo: tabs[0] },
          (response) => {
            console.log(response);
          });
      });
    } else {
      setDynamicRendering(false);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { dynamicRendering: false, tabInfo: tabs[0] },
          (response) => {
            console.log(response);
          });
      });
    }
  }


  const handleTurnOnOff = () => {
    if (turnOnOff === true) {
      setTurnOnOff(false)
      chrome.storage.local.set({ "onOff": false })

    } else {
      setTurnOnOff(true)
      chrome.storage.local.set({ "onOff": true })
    }
  }

  const handleShowWordList = () => {
    if (showWordList === true) {
      setShowWordList(false)
      // chrome.storage.local.set({ "wordListDisplay": false })
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { showWordList: false }, (response) => {
          console.log(response);
        });
      });

    } else {
      setShowWordList(true)
      // chrome.storage.local.set({ "wordListDisplay": true })
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { showWordList: true }, (response) => {
          console.log(response);
        });
      });

    }
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={handleToWordList}>單字清單</button> */}
        <Link
          href={chrome.runtime.getURL('options.html')}
          target="_blank"
          underline='none'>
          單字清單
        </Link>
        <Typography variant='subtitle2'>將{currentDomain}加入動態更新網域</Typography>
        <Switch size='small'
          checked={dynamicRendering}
          onChange={handleRenderOption} />
        <Typography variant='subtitle2'>開啟功能</Typography>
        <Switch size='small'
          checked={turnOnOff}
          onChange={handleTurnOnOff} />
        <h1>パップアップ</h1>
        <Typography variant='subtitle2'>顯示本頁詞</Typography>
        <Switch size='small'
          checked={showWordList}
          onChange={handleShowWordList} />
        {/* <h1><ruby>Hooli<rt>予你</rt>Ruby</ruby></h1> */}
      </header>
    </div>
  );
};

export default Popup;
