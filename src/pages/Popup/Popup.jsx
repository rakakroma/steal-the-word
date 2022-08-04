import { Link } from '@mui/material';
import React from 'react';
import './Popup.css';

const Popup = () => {

  // const handleToWordList = ()=>{
  //   chrome.runtime.getURL('option.html')
  // }



  return (
    <div className="App">
      <header className="App-header">
        {/* <button onClick={handleToWordList}>單字清單</button> */}
        <Link href={chrome.runtime.getURL('options.html')} target="_blank" underline='none'>
          單字清單
        </Link>
        <h1>パップアップ</h1>
        {/* <h1><ruby>Hooli<rt>予你</rt>Ruby</ruby></h1> */}
      </header>
    </div>
  );
};

export default Popup;
