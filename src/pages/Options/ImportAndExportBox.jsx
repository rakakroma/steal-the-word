import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { formatDate } from './utils/Date';
import {
  ContextListContext,
  DomainAndLinkListContext,
  TagListContext,
  WordListContext,
} from './Options';
import {
  exportToJsonFile,
  saveImportDataToDB,
  clearDB,
} from './utils/ImportExport';
import { demoData } from '../../utilsForAll/demoData';
import { grey } from '@mui/material/colors';
import { CloudDownload } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

const handleClearAll = () => {
  if (confirm('delete all?')) {
    clearDB();
    return true;
  }
  return false;
};
const SingleDataInfo = ({ title, number }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: 1,
        // backgroundColor: blue[50],
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1">{`${number || 0}`}</Typography>
    </Box>
  );
};
const CurrentDataAndDownload = ({
  userUploadedData,
  contextList,
  domainAndLinkList,
  wordList,
  tagList,
  noDataInCurrentDB,
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {userUploadedData && !noDataInCurrentDB && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 'modal',
            backgroundColor: '#b7b7b791',
            backdropFilter: 'blur(1px)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              width: '85%',
              p: 2,
              backgroundColor: 'background.paper',
            }}
          >
            ⚠️Warning: Current data will all be cleared if new data is imported
          </Typography>
        </Box>
      )}
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={1}
        sx={{ width: '260px', p: 1 }}
      >
        <Typography variant="subtitle1">
          Current Data Info
          <Tooltip title="clear all data from database" placement="right">
            <IconButton onClick={handleClearAll}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <SingleDataInfo title="words" number={wordList?.length} />
        <SingleDataInfo title="contexts" number={contextList?.length} />
        <SingleDataInfo title="tags" number={tagList?.length} />
        <SingleDataInfo title="domains" number={domainAndLinkList?.length} />
        <Box>
          <Button
            sx={{ width: '100%' }}
            LinkComponent={'a'}
            variant="contained"
            href={exportToJsonFile({
              contextList,
              domainAndLinkList,
              wordList,
              tagList,
            })}
            download={`allList backup ${formatDate(new Date())}.json`}
            disabled={noDataInCurrentDB}
          >
            <CloudDownload />
            download
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

const ImportBox = ({ loggedData, setLoggedData, noDataInCurrentDB }) => {
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

export const ImportAndExportBox = () => {
  const [loggedData, setLoggedData] = useState(null);
  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);
  const wordList = useContext(WordListContext);
  const tagList = useContext(TagListContext);

  const noDataInCurrentDB =
    contextList?.length +
      domainAndLinkList?.length +
      wordList?.length +
      tagList?.length ===
    0;
  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: 'background.paper',
        width: '1000px',

        // maxWidth: '700px',
        display: 'flex',
      }}
    >
      <CurrentDataAndDownload
        userUploadedData={Boolean(loggedData)}
        contextList={contextList}
        domainAndLinkList={domainAndLinkList}
        wordList={wordList}
        tagList={tagList}
        noDataInCurrentDB={noDataInCurrentDB}
      />
      <ImportBox
        loggedData={loggedData}
        setLoggedData={setLoggedData}
        noDataInCurrentDB={noDataInCurrentDB}
      />
    </Box>
  );
};
