import { CloudDownload } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { formatDate } from '../../../utils/Date';
import { exportToJsonFile } from '../../../utils/ImportExport';
import { ButtonContainer, DataCountGrid } from './DataCountGrid';
import { handleClearAll } from './ImportAndExportBox';
import { useTranslation } from 'react-i18next';

export const CurrentDataAndDownload = ({
  userUploadedData,
  contextList,
  domainAndLinkList,
  wordList,
  tagList,
  noDataInCurrentDB,
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ position: 'relative' }}>
      <DataCountGrid
        title={t('current Data')}
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
          ⚠️
          {t(
            'Warning: Current data will all be cleared if new data is imported'
          )}
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
            {t('download')}
          </Button>
          <Tooltip title={t('clear all data from database')} placement="bottom">
            <Button variant="outlined" color="error" onClick={handleClearAll}>
              <DeleteIcon />
              {t('Clear')}
            </Button>
          </Tooltip>
        </ButtonContainer>
      )}
    </Box>
  );
};
