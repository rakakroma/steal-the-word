import { useTheme } from '@emotion/react';
import { Button, ButtonBase, Divider } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { Fragment, useContext, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { getAllMatchTextFromWordObj } from '../../../../../utilsForAll/getInfoFromWordObj';
import { TagListContext } from '../../../allContext';
import { TagLabelChip } from '../../TagChip';
import { ContextByDefBox } from './ContextByDefBox';
import { getDataFromName, getName } from './getDataFromName';
import { CreatableSelectInput } from './inputs/CreatableSelectInput';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { useTranslation } from 'react-i18next';

export const DefinitionBlock = ({
  targetWord,
  targetWordContexts,
  controlMode,
  changingTagsWhenDisplay,
  setChangingTagsWhenDisplay,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const formMethods = useFormContext();

  const tagList = useContext(TagListContext);

  const convertToTagInputOption = (listOfTag) => {
    return listOfTag.map((tagObj) => {
      const { id, tag } = tagObj;
      return { value: id, label: tag };
    });
  };
  const tagListForOption = useMemo(
    () => convertToTagInputOption(tagList),
    [tagList]
  );

  const tagsHaveChanged = (tagName) => {
    if (controlMode !== 'display') return;
    return Object.keys(formMethods.formState.dirtyFields).includes(tagName);
  };

  const handleAddingTagsInDisplayMode = (name, defTags) => {
    setChangingTagsWhenDisplay(name);
    const defId = getDataFromName(name).id;
    formMethods.reset({
      [name]: convertToTagInputOption(defTags),
    });
  };

  return (
    <>
      {targetWord.definitions.map((definitionObj, definitionIndex) => {
        const annotation = definitionObj.annotation;
        const defId = definitionObj.definitionId;
        const contextObjsOfThisDef = targetWordContexts.filter(
          (contextObj) => contextObj.definitionRef === defId
        );
        const tagsOfThisDef = definitionObj.tags.map((tagId) => {
          const tagObj = tagList.find((tagObj) => tagObj.id === tagId);
          if (!tagObj) return { id: tagId, tag: '' };
          const { id, tag } = tagObj;
          return { id, tag };
        });

        const watchItsContexts = formMethods.watch(
          contextObjsOfThisDef.map((contextObj) =>
            getName('context', contextObj.id, false)
          )
        );

        const defWillBeDelete =
          controlMode === 'delete' &&
          watchItsContexts.findIndex((value) => value === false) === -1;

        return (
          <Box
            key={definitionObj.definitionId}
            sx={{
              backgroundColor: defWillBeDelete ? red[50] : undefined,
            }}
          >
            <TypographyOrInput
              name={getName('annotation', defId, true)}
              inputName="annotation"
              controlMode={controlMode}
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
              name={getName('note', defId, true)}
              notRequired={true}
              inputName="note"
              controlMode={controlMode}
              variant="subtitle2"
              sx={{ fontWeight: 400, wordBreak: 'break-word' }}
              content={definitionObj.note}
            />
            <Box>
              {controlMode === 'display' &&
                changingTagsWhenDisplay !== getName('tags', defId, true) && (
                  <Box>
                    {tagsOfThisDef.map((tagObj) => {
                      return (
                        <TagLabelChip key={tagObj.id} tagLabel={tagObj.tag} />
                      );
                    })}
                    <ButtonBase
                      sx={{
                        color: grey[500],
                        backgroundColor: grey[50],
                        '&:hover': { backgroundColor: grey[100] },
                      }}
                      onClick={() =>
                        handleAddingTagsInDisplayMode(
                          getName('tags', defId, true),
                          tagsOfThisDef
                        )
                      }
                    >
                      #{t('add tags')}...
                    </ButtonBase>
                  </Box>
                )}
              {changingTagsWhenDisplay === getName('tags', defId, true) && (
                <CreatableSelectInput
                  allOptions={tagListForOption}
                  selectedOptions={convertToTagInputOption(definitionObj.tags)}
                  placeholder={t(`#${t('select or type tags')}`)}
                  name={getName('tags', defId, true)}
                />
              )}
              {changingTagsWhenDisplay === getName('tags', defId, true) && (
                <Box>
                  <Button
                    size="small"
                    onClick={() => setChangingTagsWhenDisplay(null)}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    disabled={!tagsHaveChanged(getName('tags', defId, true))}
                  >
                    {t('save tag change')}
                  </Button>
                </Box>
              )}
              {contextObjsOfThisDef.map((contextObj, contextIndex) => {
                return (
                  <Fragment key={contextObj.id}>
                    <ContextByDefBox
                      contextObj={contextObj}
                      allMatchText={getAllMatchTextFromWordObj(targetWord)}
                      controlMode={controlMode}
                    />
                    {contextIndex < contextObjsOfThisDef.length - 1 && (
                      <Divider />
                    )}
                  </Fragment>
                );
              })}
            </Box>
            {definitionIndex < targetWord.definitions.length - 1 && (
              <>
                <Divider />
                <Divider sx={{ mb: 1 }} />
              </>
            )}
          </Box>
        );
      })}
    </>
  );
};
