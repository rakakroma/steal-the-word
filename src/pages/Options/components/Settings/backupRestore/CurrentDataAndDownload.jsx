import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { formatDate } from '../../../utils/Date';
import { exportToJsonFile } from '../../../utils/ImportExport';
import { CloudDownload } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleClearAll } from './ImportAndExportBox';
import { DataCountGrid, ButtonContainer } from './DataCountGrid';
import { grey, red } from '@mui/material/colors';

export const CurrentDataAndDownload = ({
  userUploadedData,
  contextList,
  domainAndLinkList,
  wordList,
  tagList,
  noDataInCurrentDB,
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <DataCountGrid
        title="current Data"
        listLengthData={{
          words: wordList?.length,
          contexts: contextList?.length,
          tags: tagList?.length,
          domains: domainAndLinkList?.length,
        }}
        deleteDecoration={userUploadedData}
      />
      {userUploadedData ? (
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            width: '107%',
            p: 1,
            bottom: '-24px',
            left: '-23px',
            backgroundColor: '#ff665e',
            color: 'white',
            borderRadius: 1,
          }}
        >
          ⚠️Warning: Current data will all be cleared if new data is imported
        </Typography>
      ) : (
        <ButtonContainer>
          <Button
            className="main-button"
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
          <Tooltip title="clear all data from database" placement="bottom">
            <Button variant="outlined" color="error" onClick={handleClearAll}>
              <DeleteIcon />
              Clear
            </Button>
          </Tooltip>
        </ButtonContainer>
      )}
    </Box>
  );
};
