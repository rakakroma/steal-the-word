import { Box, Button, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { myLog } from '../../../../Content/utils/customLogger';
import { clearDB, saveImportDataToDB } from '../../../utils/ImportExport';
import { ButtonContainer, DataCountGrid } from './DataCountGrid';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { WholeDataSchema } from '../../../../Background/dataSchema';

export const handleClearAll = () => {
  if (confirm('delete all?')) {
    clearDB();
    return true;
  }
  return false;
};

const demoDataJSONUrl =
  'https://raw.githubusercontent.com/rakakroma/steal-the-word/main/demoData.json';

const fetchDemoDataFromUrl = () =>
  axios.get(demoDataJSONUrl).then((response) => response.data);

const validateData = (data) => WholeDataSchema.safeParse(data);

export const ImportBox = ({ loggedData, setLoggedData, noDataInCurrentDB }) => {
  const [fileStatus, setFileStatus] = useState('');

  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);

    const validationResult = validateData(json);

    if (validationResult.success === false) {
      setFileStatus('invalidFile');
      console.log(validationResult.error);
    } else {
      setLoggedData(json);
      setFileStatus('');
    }
  };

  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    myLog(file.name);
    let reader = new FileReader();
    reader.onload = logFile;
    reader.readAsText(file);
  };

  const handleImportToDb = () => {
    if (!loggedData) return;
    if (!noDataInCurrentDB && !handleClearAll()) return;

    saveImportDataToDB(loggedData);
    setLoggedData(null);
  };

  const fetchDemoData = () => {
    setFileStatus('fetching');
    fetchDemoDataFromUrl()
      .then((demoData) => {
        setLoggedData(demoData);
        setFileStatus('');
      })
      .catch((err) => {
        console.error(err);
        setFileStatus('fetchFailed');
      });
  };

  if (!loggedData)
    return (
      <AskForNewDataImportBox
        handleNewFileChange={handleNewFileChange}
        fileStatus={fileStatus}
        fetchDemoData={fetchDemoData}
      />
    );

  return (
    <LoggedImportBox
      loggedData={loggedData}
      setLoggedData={setLoggedData}
      handleImportToDb={handleImportToDb}
    />
  );
};

const AskForNewDataImportBox = ({
  handleNewFileChange,
  fileStatus,
  fetchDemoData,
}) => {
  const { t } = useTranslation();

  const noticeMessage = {
    fetching: t('fetching-demo-data'),
    fetchFailed: t('cannot-fetch-the-demo-data-please-try-again'),
    invalidFile: '⚠️' + t('invalid-updated-data'),
  };

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

        <Button disabled={fileStatus === 'fetching'} onClick={fetchDemoData}>
          {t('Or Use the Demo Data')}
        </Button>
        <Typography sx={{ textAlign: 'center', p: 2 }} variant="subtitle2">
          {noticeMessage[fileStatus]}
        </Typography>
      </Box>
    </Box>
  );
};

const LoggedImportBox = ({ loggedData, setLoggedData, handleImportToDb }) => {
  const { t } = useTranslation();

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
