import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  WordListContext,
  ContextListContext,
  DomainAndLinkListContext,
  WordInfoDrawerContext,
} from '../../../Options';
import { useState } from 'react';
import { getAllMatchTextFromWordObj } from '../../../../../utilsForAll/getInfoFromWordObj.js';
import { SiteIconButton } from '../SiteIconButton';
import {
  Button,
  Divider,
  FilledInput,
  IconButton,
  Input,
  InputBase,
  Rating,
  TextField,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { db } from '../../../../Background/database';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const TypographyOrInput = (props) => {
  const { editMode, variant, sx, content, inputName, name } = props;
  const theme = useTheme();
  const { control } = useFormContext(); // retrieve all hook formMethods

  // console.log(theme.typography[variant]);
  if (!editMode) {
    return (
      <Typography sx={sx} variant={variant}>
        {props.children || content}
      </Typography>
    );
  }

  // const rules = {context:,'definition note':'', word:'',annotation:''};

  const maxLength = 460;
  const required = true;

  return (
    <Controller
      // shouldUnregister
      name={name}
      control={control}
      defaultValue={content}
      rules={{ maxLength: 460 }}
      render={({ field }) => (
        <InputBase
          // {...field}
          multiline
          fullWidth
          placeholder={inputName}
          inputRef={field.ref}
          value={field.value}
          onChange={field.onChange}
          sx={{ ...theme.typography[variant], ...sx }}
        />
      )}
    />
  );
};

const ContextByDefBox = ({ contextObj, allMatchText, editMode }) => {
  const theme = useTheme();

  const matchText = allMatchText.find(
    (matchText) => contextObj.context.indexOf(matchText) > -1
  );
  return (
    <Box sx={{ m: theme.spacing(2, 1) }}>
      <TypographyOrInput
        name={`context-*${contextObj.id}`}
        inputName="context"
        editMode={editMode}
        variant="subtitle2"
        sx={{ lineHeight: 1.2, wordBreak: 'break-all' }}
        content={contextObj.context}
      >
        <hooli-highlighter
          text={contextObj.context}
          matchword={contextObj.phrase || matchText}
        ></hooli-highlighter>
      </TypographyOrInput>
      <Box>
        <Tooltip title={contextObj.pageTitle} placement="left-end">
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.8rem',
              color: 'text.secondary',
              overflow: 'hidden',
              width: '250px',
              maxHeight: '2.1rem',
              lineHeight: '1rem',
              // whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <SiteIconButton
              iconUri={contextObj.icon}
              linkUrl={contextObj.url}
              iconSize={16}
            />
            {contextObj.pageTitle}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};
const VariantsInfo = ({ wordId, editMode, variants, stem }) => {
  const theme = useTheme();

  return (
    <Box sx={{ fontSize: '0.8rem', color: theme.palette.grey[500] }}>
      {variants?.length > 0 && (
        <>
          variants:
          <Typography
            component="span"
            sx={{
              ml: theme.spacing(1),
              fontSize: '0.8rem',
            }}
          >
            {variants.join(' ,').toString()}
          </Typography>
        </>
      )}
      {stem && (
        <>
          stem:
          <TypographyOrInput
            name={`stem-*${wordId}`}
            inputName="word"
            editMode={editMode}
            component="span"
            sx={{
              ml: theme.spacing(1),
              fontSize: '0.8rem',
            }}
            content={stem}
          ></TypographyOrInput>
        </>
      )}
    </Box>
  );
};

export const CurrentWordInfo = () => {
  const theme = useTheme();

  const { wordInfoTarget } = useContext(WordInfoDrawerContext);
  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);

  const [editMode, setEditMode] = useState(false);
  const [ratingStars, setRatingStars] = useState(false);
  const formMethods = useForm({ shouldUnregister: true });

  const handleCloseEdit = () => {
    setEditMode(false);
  };

  useEffect(() => {
    handleCloseEdit();
  }, [wordInfoTarget]);

  const targetWordId = wordInfoTarget?.wordId;
  const targetWord = targetWordId
    ? wordList.find((wordObj) => wordObj.id === targetWordId)
    : null;
  useEffect(() => {
    setRatingStars(targetWord?.stars || 0);
  }, [targetWord]);

  if (!targetWord) return <Box>Error, no target word in db</Box>;
  const allMatchText = getAllMatchTextFromWordObj(targetWord);

  const targetWordContexts = contextList
    .filter((contextObj) => contextObj.wordId === targetWordId)
    .map((contextObj) => {
      const contextDomain = new URL(contextObj.url).hostname;
      const domainObj = domainAndLinkList.find(
        (domainObj) => domainObj.url === contextDomain
      );
      contextObj.icon = domainObj?.icon;
      return contextObj;
    });
  const handleFormSubmit = (data) => {
    const changedDataKey = Object.keys(formMethods.formState.dirtyFields);
    if (changedDataKey.length > 0) {
      const changedData = changedDataKey.reduce((accu, curr) => {
        accu[curr] = data[curr];
        return accu;
      }, {});
      console.log(changedData);
    } else {
      console.log('nothing changed');
    }
  };

  const updateWordRatingInDb = (value) => {
    db.wordList
      .update({ id: targetWordId }, { stars: value })
      .then((updated) => {
        if (updated) console.log(`update ${targetWordId} to ${value} stars`);
        else console.log('Nothing was updated');
      });
  };
  const handleWordRating = (e, newValue) => {
    if (newValue === null) {
      setRatingStars(0);
      updateWordRatingInDb(0);
      return;
    }
    setRatingStars(newValue);
    updateWordRatingInDb(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <FormProvider {...formMethods}>
        <Box
          onSubmit={formMethods.handleSubmit(handleFormSubmit)}
          component={editMode ? 'form' : ''}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            margin: '5px',
            width: '100%',
            // width: '65vw',
            height: 'fit-content',
            borderRadius: '10px',
          }}
        >
          <StyledRating
            defaultValue={0}
            value={ratingStars}
            max={3}
            onChange={handleWordRating}
          />

          <Box>
            <TypographyOrInput
              name={`word-*${targetWord.id}`}
              inputName="word"
              editMode={editMode}
              variant="h6"
              sx={{
                wordBreak: 'break-word',
              }}
              content={targetWord.word}
            />
            <Divider />
            <Box sx={{ mt: theme.spacing(1) }}>
              {targetWord.definitions.map((definitionObj) => {
                const annotation = definitionObj.aliases[0];
                return (
                  <Box key={definitionObj.definitionId}>
                    <TypographyOrInput
                      name={`annotation-*${definitionObj.definitionId}`}
                      inputName="annotation"
                      editMode={editMode}
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.grey[800],
                        lineHeight: 1.2,
                        fontSize: '0.95rem',
                        wordBreak: 'break-word',
                      }}
                      content={annotation}
                    />
                    <TypographyOrInput
                      name={`def-note-*${definitionObj.definitionId}`}
                      inputName="definition note"
                      editMode={editMode}
                      variant="subtitle2"
                      sx={{ fontWeight: 400, wordBreak: 'break-all' }}
                      content={definitionObj.note}
                    />
                    <Box>
                      {targetWordContexts
                        .filter(
                          (contextObj) =>
                            contextObj.definitionRef ===
                            definitionObj.definitionId
                        )
                        .map((contextObj) => {
                          return (
                            <ContextByDefBox
                              key={contextObj.id}
                              contextObj={contextObj}
                              allMatchText={allMatchText}
                              editMode={editMode}
                            />
                          );
                        })}
                    </Box>
                    <VariantsInfo
                      wordId={targetWord.id}
                      editMode={editMode}
                      stem={targetWord.stem}
                      variants={targetWord.variants}
                    />
                  </Box>
                );
              })}
              {editMode ? (
                <Box>
                  <Button color="secondary" onClick={handleCloseEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                    Submit
                  </Button>
                </Box>
              ) : (
                <IconButton onClick={() => setEditMode(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  );
};
