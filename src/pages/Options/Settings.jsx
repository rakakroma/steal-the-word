import { Link, Box, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { formatDate } from './utils/Date';
import {
  ContextListContext,
  DomainAndLinkListContext,
  WordListContext,
} from './Options';
import {
  exportToJsonFile,
  saveImportDataToDB,
  clearDB,
} from './utils/ImportExport';
import { demoData } from '../../utilsForAll/demoData';

const ExportBox = () => {
  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);

  return (
    <Link
      href={exportToJsonFile({
        contextList,
        domainAndLinkList,
        wordList,
      })}
      download={`allList ${formatDate(new Date())}.json`}
    >
      下載全部
    </Link>
  );
};

const ImportBox = () => {
  const [loggedData, setLoggedData] = useState(null);

  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    setLoggedData(json);
    // saveImportDataToDB(json);
  };

  const handleUpload = (e) => {
    // console.log('import')
    e.preventDefault();
    if (!file.value.length) return;
    let reader = new FileReader();
    reader.onload = logFile;
    reader.readAsText(file.files[0]);
  };

  const handleImportToDb = () => {
    if (loggedData) {
      saveImportDataToDB(loggedData);
    } else {
      console.log('no uploaded data');
    }
  };
  return (
    <Box>
      <Button
        onClick={() => {
          setLoggedData(demoData);
        }}
      >
        Demo Data
      </Button>
      <form id="upload" onSubmit={handleUpload}>
        <label htmlFor="file">上傳資料（json）</label>
        <input type="file" id="file" accept=".json" />
        {/* <Input type='file' inputProps={{ accept: '.json' }} /> */}
        <button>上傳</button>
      </form>

      {loggedData ? (
        <>
          <Box>
            contextList: {loggedData?.contextList.length}
            <hr />
            domainAndLinkList:{loggedData?.domainAndLinkList.length}
            <hr />
            wordList: {loggedData?.wordList.length}
          </Box>
          <button onClick={handleImportToDb}>匯入資料庫</button>
        </>
      ) : null}
    </Box>
  );
};

export const Settings = () => {
  const handleClearAll = () => {
    if (confirm('delete all?')) {
      console.log('ok');
      clearDB();
    } else {
      console.log('cancel');
    }
  };
  return (
    <>
      <ExportBox />
      <hr />
      <ImportBox />
      <hr />
      <button onClick={handleClearAll}>clear all data from db</button>
    </>
  );
};
