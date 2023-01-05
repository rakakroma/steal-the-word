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
import { SingleDataInfo } from './SingleDataInfo';

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
