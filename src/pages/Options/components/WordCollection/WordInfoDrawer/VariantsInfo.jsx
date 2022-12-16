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

const MatchRuleSelect = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="matchRule"
      control={control}
      render={({ field }) => (
        <FormControl size="small" sx={{ minWidth: '150px', m: 1 }}>
          <InputLabel id="select-label">MatchRule</InputLabel>
          <Select
            // sx={{ height: '25px' }}
            labelId="select-label"
            value={field.value}
            autoWidth
            onChange={(e) => field.onChange(e.target.value)}
          >
            <MenuItem value={'start'}>Start</MenuItem>
            <MenuItem value={'end'}>End</MenuItem>
            <MenuItem value={'independent'}>Independent</MenuItem>
            <MenuItem value={'any'}>any</MenuItem>
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
      {title}
      {children || (
        <Box component="span" sx={{ ml: 1 }}>
          {Array.isArray(content) ? content.join(', ').toString() : content}
        </Box>
      )}
    </Box>
  );
};

export const VariantsInfo = ({ controlMode, variants, stem, matchRule }) => {
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

          <CreatableTextInput name="variants" placeholder="variants" />
        </>
      ) : (
        <>
          {stem && (
            <>
              <StyledGreySmallInfo title="stem:" content={stem} />
              <Divider />
            </>
          )}
          {variants?.length > 0 && (
            <>
              <StyledGreySmallInfo title="variants:" content={variants} />
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
            <StyledGreySmallInfo title="match rule:" content={matchRule} />
          )}
        </>
      )}
    </Box>
  );
};
