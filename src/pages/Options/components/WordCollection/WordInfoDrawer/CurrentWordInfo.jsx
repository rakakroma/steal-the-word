import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import {
  getDeletedTagsUpdateInfo,
  getExistedTagDataUpdateInfo,
  getRefData,
  getShouldUpdateTagsFromDeleteDefs,
  makeTagObj,
  tagArrayToKeyObjs,
  updateDefRef,
} from '../../../../../utilsForAll/handleTags.js';
import { db } from '../../../../Background/database.js';
import { myLog } from '../../../../Content/utils/customLogger.js';
import {
  ContextListContext,
  DomainAndLinkListContext,
  TagListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../../Options';
import { DefinitionBlock } from './DefinitionBlock.jsx';
import { getDataFromName, getDefaultValueFromData } from './getDataFromName';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { SubmitSection } from './SubmitSection';
import { VariantsInfo } from './VariantsInfo';
import { WordRating } from './WordRating';

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

  const { pathname } = useLocation();

  useEffect(() => {
    changeWordInfoTarget(null);
  }, [pathname, changeWordInfoTarget]);

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
    changeWordInfoTarget(null);
    db.wordList.delete(id);
  };

  const handleFormSubmit = (data) => {
    myLog(data);
    if (controlMode === 'display' && changingTagsWhenDisplay) {
      //handle tag submit
      const tagsData = data[changingTagsWhenDisplay];
      const refData = getRefData(
        targetWord.id,
        getDataFromName(changingTagsWhenDisplay).id
      );

      const isNewTagValue = (value) => {
        return tagList.findIndex((tagObj) => tagObj.tag === value) === -1;
      };

      const divideNewCreatedTagAndExistTag = tagsData.reduce(
        (accu, curr) => {
          const tag = curr.label;
          const tagId = curr.value;
          if (isNewTagValue(tag)) {
            const newTagObj = makeTagObj(tag, refData);
            accu.newTagObjs.push(newTagObj);
            accu.tagIdArrayForWord.push(newTagObj.id);
          } else {
            accu.notNewTagIds.push(tagId);
            accu.tagIdArrayForWord.push(tagId);
          }
          return accu;
        },
        {
          newTagObjs: [],
          notNewTagIds: [],
          tagIdArrayForWord: [],
        }
      );

      const tagUpdateInfo = getExistedTagDataUpdateInfo(
        tagArrayToKeyObjs(
          'id',
          divideNewCreatedTagAndExistTag.notNewTagIds,
          tagList
        ),
        refData
      );

      const tagIdsBeforeUpdate = targetWord.definitions.find(
        (definition) => definition.definitionId === refData.defId
      ).tags;
      const tagsDeletedFromThisDef = tagIdsBeforeUpdate.filter(
        (tagId) =>
          !divideNewCreatedTagAndExistTag.tagIdArrayForWord.includes(tagId)
      );

      const deletedTagsUpdateInfo = getDeletedTagsUpdateInfo(
        tagArrayToKeyObjs('id', tagsDeletedFromThisDef, tagList),
        refData
      );

      const newDefinitions = updateDefRef(
        targetWord.definitions,
        refData.defId,
        divideNewCreatedTagAndExistTag.tagIdArrayForWord
      );
      const shouldUpdateTags = tagUpdateInfo.shouldAddRef.concat(
        deletedTagsUpdateInfo.shouldDeleteRef
      );

      db.wordList.update(refData.wordId, { definitions: newDefinitions });
      db.tagList.bulkAdd(divideNewCreatedTagAndExistTag.newTagObjs);
      db.tagList.bulkDelete(deletedTagsUpdateInfo.shouldDeleteTagIds);
      shouldUpdateTags.forEach((tagData) => {
        const { wordDefRefs } = tagData;
        db.tagList.update(tagData.id, { wordDefRefs });
      });

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
        const { tagShouldBeDelete, tagShouldUpdateItsRefs } =
          getShouldUpdateTagsFromDeleteDefs(
            targetWord.id,
            targetWord.definitions,
            tagList
          );
        db.tagList.bulkDelete(tagShouldBeDelete);
        tagShouldUpdateItsRefs.forEach((tagData) => {
          const { wordDefRefs } = tagData;
          db.tagList.update(tagData.id, { wordDefRefs });
        });

        return;
      }
      const contextIdsToDelete = Object.keys(data)
        .filter((name) => data[name] === true)
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
      const defsThatWouldBeDelete = targetWord.definitions.filter(
        (definition) => !defRefThatStillExist.includes(definition.definitionId)
      );

      const { tagShouldBeDelete, tagShouldUpdateItsRefs } =
        getShouldUpdateTagsFromDeleteDefs(
          targetWord.id,
          defsThatWouldBeDelete,
          tagList
        );
      db.tagList.bulkDelete(tagShouldBeDelete);
      tagShouldUpdateItsRefs.forEach((tagData) => {
        const { wordDefRefs } = tagData;
        db.tagList.update(tagData.id, { wordDefRefs });
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
        myLog('------word info------');
        myLog(wordObjInfoToUpdate);
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
        myLog('---defsArrayToUpdate----');
        myLog(defsArrayToUpdate);
        db.wordList.update(
          { id: targetWord.id },
          { definitions: defsArrayToUpdate }
        );
      }
      if (newContextInfo) {
        myLog('---contextObjsToUpdate----');
        myLog(contextObjsToUpdate);
        contextObjsToUpdate.forEach((idAndContext) => {
          const { id, context } = idAndContext;
          db.contextList.update({ id }, { context });
        });
      }
      setControlMode('display');
    } else {
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
