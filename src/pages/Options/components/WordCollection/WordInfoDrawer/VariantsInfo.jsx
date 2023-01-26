import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CreatableTextInput } from './inputs/CreatableSelectInput';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { useTranslation } from 'react-i18next';

const MatchRuleSelect = () => {
  const { control } = useFormContext();

  const { t } = useTranslation();
  return (
    <Controller
      name="matchRule"
      control={control}
      render={({ field }) => (
        <FormControl size="small" sx={{ minWidth: '150px', m: 1 }}>
          <InputLabel id="select-label">{t('match rule')}</InputLabel>
          <Select
            labelId="select-label"
            value={field.value}
            autoWidth
            onChange={(e) => field.onChange(e.target.value)}
          >
            <MenuItem value={'start'}>{t('start')}</MenuItem>
            <MenuItem value={'end'}>{t('end')}</MenuItem>
            <MenuItem value={'independent'}>{t('independent')}</MenuItem>
            <MenuItem value={'any'}>{t('any')}</MenuItem>
          </Select>
        </FormControl>
      )}
    />
  );
};

const StyledGreySmallInfo = (props) => {
  const { title, content, children } = props;
  return (
    <Box
      component="span"
      sx={{
        mr: 1,
        color: 'text.secondary',
        fontSize: '0.8rem',
      }}
    >
      {title && `${title}:`}
      {children || (
        <Box component="span" sx={{ ml: 1 }}>
          {Array.isArray(content) ? content.join(', ').toString() : content}
        </Box>
      )}
    </Box>
  );
};

export const VariantsInfo = ({ controlMode, variants, stem, matchRule }) => {
  const { t } = useTranslation();
  const editMode = controlMode === 'edit';
  if ((variants?.length === 0 || !variants) && !stem && !matchRule && !editMode)
    return null;
  return (
    <Box sx={{ borderRadius: 1, m: 1, p: 1, backgroundColor: grey[100] }}>
      {editMode ? (
        <>
          <StyledGreySmallInfo>
            <TypographyOrInput
              notRequired={true}
              name="stem"
              inputName="stem"
              controlMode={controlMode}
              component="span"
              sx={{
                fontSize: '0.8rem',
              }}
              content={stem}
            ></TypographyOrInput>
          </StyledGreySmallInfo>

          <CreatableTextInput name="variants" placeholder={t('variants')} />
        </>
      ) : (
        <>
          {stem && (
            <>
              <StyledGreySmallInfo title={t('stem')} content={stem} />
              <Divider />
            </>
          )}
          {variants?.length > 0 && (
            <>
              <StyledGreySmallInfo title={t('variants')} content={variants} />
              <Divider />
            </>
          )}
        </>
      )}
      {editMode ? (
        <MatchRuleSelect />
      ) : (
        <>
          {matchRule && (
            <StyledGreySmallInfo title={t('match rule')} content={matchRule} />
          )}
        </>
      )}
    </Box>
  );
};
