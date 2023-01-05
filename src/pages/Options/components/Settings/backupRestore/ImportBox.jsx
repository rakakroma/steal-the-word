import { Box, Button, Typography, Stack } from '@mui/material';
import React from 'react';
import { saveImportDataToDB } from '../../../utils/ImportExport';
import { demoData } from '../../../../../utilsForAll/demoData';
import { grey } from '@mui/material/colors';
import { handleClearAll } from './ImportAndExportBox';
import { SingleDataInfo } from './SingleDataInfo';

export const ImportBox = ({ loggedData, setLoggedData, noDataInCurrentDB }) => {
  const logFile = (event) => {
    let str = event.target.result;
    let json = JSON.parse(str);
    setLoggedData(json);
    // saveImportDataToDB(json);
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
    // if (!file.value.length) return;
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
          flexGrow: 1,
          position: 'relative',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ position: 'absolute', top: 1, left: 1 }}
        >
          Restore
        </Typography>
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
      {loggedData && (
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          spacing={1}
          sx={{ p: 1, width: '320px', minWidth: '200px' }}
        >
          <Typography variant="subtitle1">Uploaded Data Info</Typography>
          <SingleDataInfo title="words" number={loggedData.wordList?.length} />
          <SingleDataInfo
            title="contexts"
            number={loggedData.contextList?.length}
          />
          <SingleDataInfo title="tags" number={loggedData.tagList?.length} />
          <SingleDataInfo
            title="domains"
            number={loggedData.domainAndLinkList?.length}
          />
          <Box>
            <Button onClick={() => setLoggedData(null)}>Cancel</Button>
            <Button onClick={handleImportToDb}>Import</Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
};
