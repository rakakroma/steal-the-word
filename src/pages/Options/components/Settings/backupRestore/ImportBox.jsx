import { Box, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { myLog } from '../../../../Content/utils/customLogger';
import { saveImportDataToDB } from '../../../utils/ImportExport';
import { ButtonContainer, DataCountGrid } from './DataCountGrid';
import { handleClearAll } from './ImportAndExportBox';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// 'https://api.github.com/repos/rakakroma/steal-the-word/contents/demoData.json'
// ('https://raw.githubusercontent.com/rakakroma/steal-the-word/main/demoData.json');

const fetchDemoData = () =>
  axios
    .get(
      'https://raw.githubusercontent.com/rakakroma/steal-the-word/main/demoData.json'
    )
    .then((response) => response.data);

export const ImportBox = ({ loggedData, setLoggedData, noDataInCurrentDB }) => {
  const { t } = useTranslation();

  const [fetchStatus, setFetchStatus] = useState('');

  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    setLoggedData(json);
  };

  const handleImportToDb = () => {
    if (!loggedData) return;
    if (!noDataInCurrentDB && !handleClearAll()) return;
    saveImportDataToDB(loggedData);
    setLoggedData(null);
  };
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    myLog(file.name);
    let reader = new FileReader();
    reader.onload = logFile;
    reader.readAsText(file);
  };

  if (!loggedData)
    return (
      <Box
        sx={{
          backgroundColor: grey[200],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '100%',
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label htmlFor="file">
            <Button component="div" variant="contained">
              {t('upload_data')}
            </Button>
          </label>
          <input
            style={{ display: 'none' }}
            type="file"
            id="file"
            accept=".json"
            onChange={handleNewFileChange}
          />

          <Button
            disabled={fetchStatus === 'fetching'}
            onClick={() => {
              setFetchStatus('fetching');
              fetchDemoData()
                .then((demoData) => {
                  setLoggedData(demoData);
                  setFetchStatus('');
                })
                .catch((err) => {
                  console.error(err);
                  setFetchStatus('failed');
                });
            }}
          >
            {t('Or Use the Demo Data')}
          </Button>
          {fetchStatus === 'failed' && (
            <Typography variant="subtitle1">
              ⚠️{t('cannot-fetch-the-demo-data-please-try-again')}
            </Typography>
          )}
          {fetchStatus === 'fetching' && (
            <Typography variant="subtitle1">
              {t('Demo data is fetching...')}
            </Typography>
          )}
        </Box>
      </Box>
    );

  return (
    <Box>
      <DataCountGrid
        title={t('Uploaded Data Info')}
        listLengthData={{
          words: loggedData.wordList?.length,
          contexts: loggedData.contextList?.length,
          tags: loggedData.tagList?.length,
          domains: loggedData.domainAndLinkList?.length,
        }}
        isImportedData={true}
      />
      <ButtonContainer>
        <Button
          onClick={handleImportToDb}
          variant="contained"
          className="main-button"
        >
          {t('Import')}
        </Button>
        <Button variant="outlined" onClick={() => setLoggedData(null)}>
          {t('Cancel')}
        </Button>
      </ButtonContainer>
    </Box>
  );
};
