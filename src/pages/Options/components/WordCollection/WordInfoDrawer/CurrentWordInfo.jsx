import {
  Button,
  ButtonBase,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { grey, red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { db } from '../../../../Background/database.js';
import {
  ContextListContext,
  DomainAndLinkListContext,
  TagListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../../Options';
import { CreatableSelectInput } from './inputs/CreatableSelectInput';
import { DefinitionBlock } from './DefinitionBlock.jsx';
import { SubmitSection } from './SubmitSection';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { VariantsInfo } from './VariantsInfo';
import { WordRating } from './WordRating';
import { nanoid } from 'nanoid';
import { getDataFromName, getDefaultValueFromData } from './getDataFromName';

export const CurrentWordInfo = () => {
  const theme = useTheme();

  const { wordInfoTarget, changeWordInfoTarget } = useContext(
    WordInfoDrawerContext
  );
  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);
  const tagList = useContext(TagListContext);

  const [controlMode, setControlMode] = useState('display');
  const [changingTagsWhenDisplay, setChangingTagsWhenDisplay] = useState(null);

  const handleCloseEdit = () => {
    setControlMode('display');
    //TODO: maybe an alert to prevent unsaved change
  };

  useEffect(() => {
    handleCloseEdit();
  }, [wordInfoTarget]);

  useEffect(() => {
    setChangingTagsWhenDisplay(null);
  }, [wordInfoTarget, controlMode]);

  const formMethods = useForm({
    shouldUnregister: true,
    mode: 'onChange',
  });

  const targetWordId = wordInfoTarget?.wordId;
  const targetWord = targetWordId
    ? wordList.find((wordObj) => wordObj.id === targetWordId)
    : null;
  const targetWordContexts = contextList
    ?.filter((contextObj) => contextObj.wordId === targetWordId)
    ?.map((contextObj) => {
      const contextDomain = new URL(contextObj.url).hostname;
      const domainObj = domainAndLinkList.find(
        (domainObj) => domainObj.url === contextDomain
      );
      contextObj.icon = domainObj?.icon;
      return contextObj;
    });

  const onlyOneContext = targetWordContexts?.length === 1;

  const deleteWordInDb = (id) => {
    db.wordList.delete(id);
    changeWordInfoTarget(null);
  };

  const isNewTagValue = (value) => {
    return tagList.findIndex((tagObj) => tagObj.tag === value) === -1;
  };

  const handleFormSubmit = (data) => {
    console.log(data);
    if (controlMode === 'display' && changingTagsWhenDisplay) {
      //handle tag submit
      const tagsData = data[changingTagsWhenDisplay];
      const checkSameTagData = (firstData, secondData) => {
        return (
          firstData.wordId === secondData.wordId &&
          firstData.defId === secondData.defId
        );
      };
      const refData = {
        wordId: targetWord.id,
        defId: getDataFromName(changingTagsWhenDisplay).id,
      };
      const tagIdArrayForWord = [];

      tagsData.forEach((tagData) => {
        const tag = tagData.label;

        if (isNewTagValue(tag)) {
          const newTagData = {
            id: nanoid(),
            tag,
            wordDefRefs: [refData],
          };
          db.tagList.add(newTagData);
          tagIdArrayForWord.push(newTagData.id);
        } else {
          const id = tagData.value;
          const wordDefRefsBeforeUpdate = tagList.find(
            (tagObj) => tagObj.id === id
          ).wordDefRefs;

          const wordRefIsNotInTagData = //the tag is newly added to the word
            wordDefRefsBeforeUpdate.findIndex((wordDefData) =>
              checkSameTagData(wordDefData, refData)
            ) === -1;
          if (wordRefIsNotInTagData) {
            db.tagList.update(id, {
              wordDefRefs: [...wordDefRefsBeforeUpdate, refData],
            });
          }
          tagIdArrayForWord.push(id);
        }
      });

      const tagsBeforeUpdate = targetWord.definitions.find(
        (definition) => definition.definitionId === refData.defId
      ).tags;
      const tagsDeletedFromThisDef = tagsBeforeUpdate.filter(
        (tagId) => !tagIdArrayForWord.includes(tagId)
      );

      tagsDeletedFromThisDef.forEach((tagId) => {
        const tagObjInData = tagList.find((tagObj) => tagObj.id === tagId);
        console.log(tagObjInData.wordDefRefs);
        // console.log(checkSameTagData(tagObjInData.wordDefRefs[0], refData));
        console.log();
        if (
          tagObjInData.wordDefRefs.length === 1 &&
          checkSameTagData(tagObjInData.wordDefRefs[0], refData)
        ) {
          console.log('delete');
          db.tagList.delete(tagId);
        } else {
          console.log('update');
          const newDefRefs = tagObjInData.wordDefRefs.filter(
            (refObj) => !checkSameTagData(refObj, refData)
          );
          db.tagList.update(tagId, { wordDefRefs: newDefRefs });
        }
      });

      const newDefinitions = targetWord.definitions.map((definition) => {
        if (definition.definitionId === refData.defId) {
          definition.tags = tagIdArrayForWord;
        }
        return definition;
      });

      db.wordList.update(targetWord.id, { definitions: newDefinitions });
      console.log('changing tags');
      setChangingTagsWhenDisplay(null);

      return;
    }
    if (controlMode === 'delete') {
      if (onlyOneContext || data.word === true) {
        const contextIdsToDelete = targetWordContexts.map(
          (contextObj) => contextObj.id
        );
        db.contextList.bulkDelete(contextIdsToDelete);
        deleteWordInDb(targetWord.id);
        return;
      }
      //context data only
      const contextIdsToDelete = Object.keys(data)
        .filter((name) => {
          return data[name] === true;
        })
        .map((qualifiedName) => {
          return +getDataFromName(qualifiedName).id;
        });

      const defRefThatStillExist = targetWordContexts.reduce((accu, curr) => {
        const defRef = curr.definitionRef;
        if (accu.indexOf(defRef) > -1) return accu;
        if (contextIdsToDelete.indexOf(curr.id) > -1) return accu;
        return accu.concat(defRef);
      }, []);
      const defsThatStillExist = targetWord.definitions.filter((definition) => {
        return defRefThatStillExist.indexOf(definition.definitionId) > -1;
      });

      db.contextList.bulkDelete(contextIdsToDelete);
      db.wordList.update(targetWord.id, {
        definitions: defsThatStillExist,
      });
      setControlMode('display');
      return;
    }

    const changedDataKey = Object.keys(formMethods.formState.dirtyFields);

    if (changedDataKey.length > 0) {
      let newWordInfo = false;
      let newDefInfo = false;
      let newContextInfo = false;
      const wordObjInfoToUpdate = {};
      const defsArrayToUpdate = [...targetWord.definitions];
      const contextObjsToUpdate = [];
      const tagsToUpdate = [];
      changedDataKey.forEach((key) => {
        if (['word', 'variants', 'stem', 'matchRule'].includes(key)) {
          if (!newWordInfo) {
            newWordInfo = true;
          }
          if (key === 'variants') {
            wordObjInfoToUpdate.variants = data.variants.map(
              (valueAndLabel) => valueAndLabel.value
            );
            return;
          }
          const inputResult = data[key].trim();
          wordObjInfoToUpdate[key] = inputResult;
          //TODO: check no duplicate word
        }
        if (key.startsWith('def**')) {
          if (!newDefInfo) {
            newDefInfo = true;
          }
          const [_, inputName, definitionId] = key.split('**');
          if (inputName === 'tags') {
            console.log(data[key]);
            return;
          }
          const inputResult = data[key].trim();
          const targetDefIndex = defsArrayToUpdate.findIndex(
            (definition) => definition.definitionId === definitionId
          );
          defsArrayToUpdate[targetDefIndex][inputName] = inputResult;
        }
        if (key.startsWith('context**')) {
          if (!newContextInfo) {
            newContextInfo = true;
          }
          const [, inputName, contextId] = key.split('**');
          const inputResult = data[key].trim();
          contextObjsToUpdate.push({ id: +contextId, context: inputResult });
          //currently only context value, if there is more value for contextObj in the future, it would cause bugs
        }
      });
      if (newWordInfo) {
        console.log('------word info------');
        console.log(wordObjInfoToUpdate);
        db.wordList.update({ id: targetWord.id }, wordObjInfoToUpdate);
        // if (wordObjInfoToUpdate.word) {
        //   targetWordContexts.forEach((contextObj) => {
        //     db.contextList.update(
        //       { id: +contextObj.id },
        //       { word: wordObjInfoToUpdate.word }
        //     );
        //   });
        // }
      }
      if (newDefInfo) {
        console.log('---defsArrayToUpdate----');
        console.log(defsArrayToUpdate);
        db.wordList.update(
          { id: targetWord.id },
          { definitions: defsArrayToUpdate }
        );
      }
      if (newContextInfo) {
        console.log('---contextObjsToUpdate----');
        console.log(contextObjsToUpdate);
        contextObjsToUpdate.forEach((idAndContext) => {
          const { id, context } = idAndContext;
          db.contextList.update({ id }, { context });
        });
      }
      setControlMode('display');
    } else {
      console.log('nothing changed');
    }
  };

  const isDeletingAll =
    controlMode === 'delete' &&
    (formMethods.watch('word') === true || onlyOneContext);
  if (!wordInfoTarget) return null;
  if (!targetWord) return <Box>Error, no target word in db</Box>;

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}
        onSubmit={formMethods.handleSubmit(handleFormSubmit)}
      >
        <Box
          sx={{
            backgroundColor: isDeletingAll ? red[50] : undefined,
            display: 'flex',
            flexDirection: 'column',
            margin: 1,
            width: '100%',
            height: 'fit-content',
            borderRadius: '10px',
          }}
        >
          {controlMode !== 'delete' && <WordRating targetWord={targetWord} />}
          <Box>
            <TypographyOrInput
              checkable={true}
              name="word"
              inputName="word"
              controlMode={controlMode}
              variant="h6"
              sx={{
                wordBreak: 'break-word',
              }}
              content={targetWord.word}
            />
            <Divider />
            <Box sx={{ mt: theme.spacing(1) }}>
              <DefinitionBlock
                targetWord={targetWord}
                targetWordContexts={targetWordContexts}
                controlMode={controlMode}
                changingTagsWhenDisplay={changingTagsWhenDisplay}
                setChangingTagsWhenDisplay={setChangingTagsWhenDisplay}
              />
              <VariantsInfo
                controlMode={controlMode}
                stem={targetWord.stem}
                variants={targetWord.variants}
                matchRule={targetWord.matchRule}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <SubmitSection
            defaultData={getDefaultValueFromData(
              targetWord,
              targetWordContexts
            )}
            onlyOneContext={onlyOneContext}
            handleCloseEdit={handleCloseEdit}
            controlMode={controlMode}
            setControlMode={setControlMode}
            disableSubmit={
              Object.keys(formMethods.formState.dirtyFields).length === 0 ||
              formMethods.formState.isSubmitting
            }
          />
        </Box>
      </Box>
    </FormProvider>
  );
};
