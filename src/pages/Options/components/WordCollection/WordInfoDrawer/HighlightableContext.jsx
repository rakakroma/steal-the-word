import { Button, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { db } from '../../../../Background/database';
import { DateOfContext } from './DateOfContext';
import { useTranslation } from 'react-i18next';

export const HighlightableContext = ({
  contextObj,
  matchTexts,
  highlightable,
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState(contextObj.phrase || '');
  const [askIfSubmit, setAskIfSubmit] = useState(false);

  const { t } = useTranslation();

  if (!highlightable)
    return (
      <hooli-highlighter
        text={contextObj.context}
        matchword={selectedPhrase || matchTexts[0]}
      ></hooli-highlighter>
    );

  const stopSelection = () => {
    window.getSelection().removeAllRanges();
  };

  const handleHighlightSelect = () => {
    const selectedString = window.getSelection().toString().trim();
    if (!selectedString || contextObj.context.indexOf(selectedString) < 0)
      return;
    setSelectedPhrase(selectedString);
    setAskIfSubmit(true);
    stopSelection();
  };

  const submitNewPhrase = () => {
    db.contextList.update({ id: contextObj.id }, { phrase: selectedPhrase });
    setAskIfSubmit(false);
  };
  const cancelNewPhrase = () => {
    setSelectedPhrase(contextObj.phrase || '');
    setAskIfSubmit(false);
  };

  return (
    <>
      <Tooltip
        title={t('select context text and highlight')}
        placement="top"
        disableInteractive
      >
        <Box
          onMouseUp={handleHighlightSelect}
          sx={{
            '&:hover': {
              backgroundColor: grey[200],
            },
          }}
        >
          <hooli-highlighter
            text={contextObj.context}
            matchword={selectedPhrase || matchTexts[0]}
          ></hooli-highlighter>
          <DateOfContext date={contextObj.date} />
        </Box>
      </Tooltip>
      {askIfSubmit && (
        <Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            onClick={cancelNewPhrase}
          >
            {t('Cancel')}
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
            onClick={submitNewPhrase}
          >
            {t('Highlight This')}
          </Button>
        </Box>
      )}
    </>
  );
};
