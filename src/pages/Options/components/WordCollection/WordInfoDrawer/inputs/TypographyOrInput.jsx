import { Checkbox, FormControlLabel, InputBase } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useContext, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { getFlatList } from '../../../../../../utilsForAll/getMatchTextWithIdRef';
import { WordListContext } from '../../../../Options';

export const TypographyOrInput = (props) => {
  const {
    controlMode,
    variant,
    sx,
    content,
    inputName,
    name,
    notRequired,
    checkable,
  } = props;
  const theme = useTheme();
  const { control, formState, setValue, getValues } = useFormContext();

  const handleCheckboxUpdate = (field, newValue) => {
    const currentFormData = getValues();
    if (field.name === 'word') {
      Object.keys(currentFormData).forEach((name) => {
        setValue(name, newValue);
      });
    } else {
      if (currentFormData.word === true) {
        setValue('word', false);
      } else if (
        Object.values(currentFormData).filter((value) => value === false)
          .length === 2 &&
        newValue
      ) {
        setValue('word', true);
      }
      setValue(field.name, newValue);
    }
  };

  const checkBlankAfterTrim = (value) => value.trim().length > 0;

  const wordList = useContext(WordListContext);
  const flatWordListToFindDuplicateWord = useMemo(
    () => getFlatList(wordList),
    [wordList]
  );

  const checkNoSameWord = (value) => {
    if (value === content) return true;
    //FIXME: if the new word match its own variants or stem, it would still show error,
    //no helper text to tell user what happened

    return !flatWordListToFindDuplicateWord.includes(value);
  };

  const validationFunction = (value) => {
    if (!['word', 'stem'].includes(inputName)) {
      return checkBlankAfterTrim(value);
    } else {
      return checkBlankAfterTrim(value) && checkNoSameWord(value);
    }
  };
  const rules = { maxLength: 460 };
  if (!notRequired) {
    rules.required = true;
    rules.validate = validationFunction;
  }

  const TextNode = () => {
    return (
      <Typography sx={{ ...sx }} variant={variant}>
        {props.children || content}
      </Typography>
    );
  };
  const contextsMoreThanTwo =
    controlMode === 'delete' && Object.keys(getValues()).length > 2;

  if (controlMode === 'delete' && checkable && contextsMoreThanTwo) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            sx={{
              ...theme.typography[variant],
              ...sx,
            }}
            control={
              <Checkbox
                onChange={(e, newValue) =>
                  handleCheckboxUpdate(field, newValue)
                }
                checked={field.value}
              />
            }
            label={<TextNode />}
          />
        )}
      />
    );
  }

  if (controlMode === 'edit') {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <InputBase
            // {...field}
            error={Boolean(formState.errors[name])}
            // inputProps={rules}
            multiline
            fullWidth
            placeholder={inputName}
            inputRef={field.ref}
            value={field.value}
            onChange={field.onChange}
            sx={{
              ...theme.typography[variant],
              ...sx,
              mb: 1,
              pl: 1,
              backgroundColor: grey[200],
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '',
              },
              '&:focus-within': {
                outline: `1px solid hsl(0, 0%, 80%)`,
              },
              '&.Mui-error': {
                outline: `1px solid ${theme.palette.error.main}`,
              },
            }}
          />
        )}
      />
    );
  }
  return <TextNode />;
};
