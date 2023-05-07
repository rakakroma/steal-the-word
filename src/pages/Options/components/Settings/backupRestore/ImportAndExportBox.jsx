import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import {
  ContextListContext,
  DomainAndLinkListContext,
  TagListContext,
  WordListContext,
} from '../../../allContext';
import { clearDB } from '../../../utils/ImportExport';
import { CurrentDataAndDownload } from './CurrentDataAndDownload';
import { ImportBox } from './ImportBox';

export const handleClearAll = () => {
  if (confirm('delete all?')) {
    clearDB();
    return true;
  }
  return false;
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
    <Box display="flex" flexDirection="column">
      <Box width="100%">
        <CurrentDataAndDownload
          userUploadedData={Boolean(loggedData)}
          contextList={contextList}
          domainAndLinkList={domainAndLinkList}
          wordList={wordList}
          tagList={tagList}
          noDataInCurrentDB={noDataInCurrentDB}
        />
      </Box>
      <Box width="100%" minHeight="200px" my={4}>
        <ImportBox
          loggedData={loggedData}
          setLoggedData={setLoggedData}
          noDataInCurrentDB={noDataInCurrentDB}
        />
      </Box>
    </Box>
  );
};
