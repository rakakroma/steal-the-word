import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { db } from '../../../../Background/database';
import { BorderColor } from '@mui/icons-material';
import { ContextDate } from './ContextByDefBox';
import { DateOfContext } from './dateDisplay';

export const HighlightableContext = ({
  contextObj,
  matchTexts,
  highlightable,
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState(contextObj.phrase || '');
  const [askIfSubmit, setAskIfSubmit] = useState(false);
  const theme = useTheme();

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
    if (
      !selectedString ||
      contextObj.context.indexOf(selectedString) < 0 ||
      !matchTexts.find((text) => selectedString.indexOf(text) > 0)
    )
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
      <Box
        onMouseUp={handleHighlightSelect}
        sx={{
          '&:hover': {
            // cursor: `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='12px' height='12px' viewBox='0 0 12 12' version='1.1'%3E%3Cg id='surface1'%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 5.445312 5.9375 C 5.074219 5.894531 4.699219 5.996094 4.398438 6.21875 C 4.0625 6.519531 3.835938 6.921875 3.742188 7.363281 C 3.652344 7.839844 3.394531 8.269531 3.015625 8.570312 C 2.941406 8.605469 2.875 8.652344 2.816406 8.707031 C 2.761719 8.765625 2.75 8.859375 2.796875 8.925781 C 2.835938 8.960938 2.882812 8.984375 2.929688 8.992188 C 4.035156 9.246094 5.449219 9.328125 6.355469 8.511719 C 6.730469 8.175781 6.902344 7.667969 6.816406 7.171875 C 6.730469 6.679688 6.394531 6.261719 5.929688 6.070312 C 5.777344 6 5.613281 5.957031 5.445312 5.9375 Z M 5.445312 5.9375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 7.644531 6.507812 C 9.546875 4.34375 11.964844 1.371094 11.332031 0.738281 C 10.699219 0.105469 8.078125 3.058594 6.195312 5.125 C 6.839844 5.375 7.363281 5.875 7.644531 6.507812 Z M 7.644531 6.507812 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 2.488281 1.984375 L 2.289062 1.304688 C 1.742188 1.679688 1.304688 2.195312 1.019531 2.796875 L 1.683594 2.957031 C 1.878906 2.578125 2.15625 2.25 2.488281 1.984375 Z M 2.488281 1.984375 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 4.332031 C 1.332031 4.253906 1.351562 4.175781 1.355469 4.097656 L 0.695312 3.9375 C 0.675781 4.082031 0.667969 4.226562 0.667969 4.371094 L 0.667969 5.40625 L 1.332031 5.40625 Z M 1.332031 4.332031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.332031 7.667969 L 1.332031 6.59375 L 0.667969 6.59375 L 0.667969 7.628906 C 0.667969 7.796875 0.679688 7.960938 0.703125 8.125 L 1.363281 7.964844 C 1.347656 7.863281 1.339844 7.765625 1.332031 7.667969 Z M 1.332031 7.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 1.714844 9.097656 L 1.046875 9.257812 C 1.332031 9.835938 1.757812 10.332031 2.289062 10.691406 L 2.492188 10.011719 C 2.171875 9.765625 1.90625 9.453125 1.714844 9.097656 Z M 1.714844 9.097656 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 10.667969 C 4.074219 10.664062 3.816406 10.625 3.566406 10.554688 L 3.378906 11.195312 C 4.027344 11.378906 4.714844 11.378906 5.363281 11.195312 L 5.167969 10.535156 C 4.898438 10.617188 4.617188 10.664062 4.332031 10.667969 Z M 4.332031 10.667969 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.960938 9.082031 C 6.78125 9.421875 6.53125 9.722656 6.238281 9.964844 L 6.449219 10.695312 C 6.980469 10.332031 7.410156 9.839844 7.691406 9.261719 Z M 6.960938 9.082031 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 6.980469 2.953125 C 7.160156 2.757812 7.332031 2.574219 7.5 2.398438 C 7.226562 1.964844 6.871094 1.59375 6.449219 1.304688 L 6.238281 2.035156 C 6.542969 2.285156 6.796875 2.597656 6.980469 2.953125 Z M 6.980469 2.953125 '/%3E%3Cpath style=' stroke:none;fill-rule:nonzero;fill:rgb(27.45098%25,27.45098%25,27.45098%25);fill-opacity:1;' d='M 4.332031 1.332031 C 4.617188 1.335938 4.898438 1.382812 5.167969 1.464844 L 5.359375 0.804688 C 4.710938 0.621094 4.027344 0.621094 3.378906 0.804688 L 3.566406 1.445312 C 3.816406 1.375 4.074219 1.335938 4.332031 1.332031 Z M 4.332031 1.332031 '/%3E%3C/g%3E%3C/svg%3E%0A"), auto`,
            '.highlight-help': {
              display: 'inline',
            },
          },
        }}
      >
        <hooli-highlighter
          text={contextObj.context}
          matchword={selectedPhrase || matchTexts[0]}
        ></hooli-highlighter>
        <DateOfContext date={contextObj.date} />
        <Typography
          variant="subtitle2"
          sx={{
            display: 'none',
            ml: 1,
            color: theme.palette.warning.main,
          }}
          className="highlight-help"
        >
          <BorderColor fontSize="12px" />
          select to highlight
        </Typography>
      </Box>
      {askIfSubmit && (
        <Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
            onClick={cancelNewPhrase}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
            onClick={submitNewPhrase}
          >
            Highlight This
          </Button>
        </Box>
      )}
    </>
  );
};
