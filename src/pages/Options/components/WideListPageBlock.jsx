import {
  Divider,
  Input,
  Link,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, fontSize } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
// import { countDate } from "../utils/countDate"
// import { fullDate } from "../utils/Date"
import { Highlighter } from './Highlighter';
import React, { useState } from 'react';
import { WideListWordBlock } from './WideListWordBlock';
// import { getLatestDateInContextInfos, getMatchedContextInfos } from "../utils/transformData";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

export const WideListPageBlock = ({
  wordsFromThisPage,
  setShowNotification,
  url,
  hideAlias,
  handleDelete,
  handleEdit,
  handleSelectPhrase,
  contextsFromThisPage,
  editWord,
  setEditWord,
}) => {
  dayjs.extend(relativeTime);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <Box>
        <Link
          sx={{
            display: 'inline-block',
            textOverflow: 'ellipsis',
            width: ' auto',
            maxWidth: '50vw',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textAlign: 'right',
            verticalAlign: 'bottom',
          }}
          variant="subtitle1"
          underline="none"
          href={url}
          color="primary.light"
        >
          {contextsFromThisPage[0].pageTitle}
        </Link>
        &emsp;
        <Tooltip
          title={dayjs(contextsFromThisPage[0].date).format(
            'YYYY-MM-DD HH:MM ddd'
          )}
          placement="top"
        >
          <Typography variant="subtitle1" component={'span'}>
            {' '}
            {dayjs(contextsFromThisPage[0].date).toNow()}{' '}
          </Typography>
        </Tooltip>
      </Box>
      <List
        sx={{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'secondary.main',
          borderRadius: '15px',
          width: '70vw',
          backgroundColor: 'background.light',
        }}
      >
        {contextsFromThisPage.map((contextObj, index) => {
          return (
            <WideListWordBlock
              url={url}
              key={contextObj.id}
              wordObj={wordsFromThisPage.find(
                (wordObj) => wordObj.id === contextObj.wordId
              )}
              contextObj={contextObj}
              index={index}
              editWord={editWord}
              setEditWord={setEditWord}
              hideAlias={hideAlias}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleSelectPhrase={handleSelectPhrase}
              contextsFromThisPage={contextsFromThisPage}
              setShowNotification={setShowNotification}
            />
          );
        })}
      </List>
    </Box>
  );
};
