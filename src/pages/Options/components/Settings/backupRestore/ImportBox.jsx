import { Box, Button, Typography, Stack } from '@mui/material';
import React from 'react';
import { saveImportDataToDB } from '../../../utils/ImportExport';
import { demoData } from '../../../../../utilsForAll/demoData';
import { grey } from '@mui/material/colors';
import { handleClearAll } from './ImportAndExportBox';
import { ButtonContainer, DataCountGrid } from './DataCountGrid';

export const ImportBox = ({ loggedData, setLoggedData, noDataInCurrentDB }) => {
  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    setLoggedData(json);
  };

  const handleImportToDb = () => {
    if (!loggedData) return;
    if (!noDataInCurrentDB && !handleClearAll()) return;
    saveImportDataToDB(loggedData);
    console.log('saved');
    setLoggedData(null);
  };
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file.name);
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="file">
            <Button component="div" variant="contained">
              Upload data (.json)
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
            onClick={() => {
              setLoggedData(demoData);
            }}
          >
            Or Use the Demo Data
          </Button>
        </Box>
      </Box>
    );

  return (
    <Box>
      <DataCountGrid
        title="Uploaded Data Info"
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
          Import
        </Button>
        <Button variant="outlined" onClick={() => setLoggedData(null)}>
          Cancel
        </Button>
      </ButtonContainer>
    </Box>
  );
};
