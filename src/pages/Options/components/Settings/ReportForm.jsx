import {
  Box,
  Button,
  FormControlLabel,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';
import { myLog } from '../../../Content/utils/customLogger';
import { postFormApi } from '../../../../utilsForAll/formApi';
import { Check, CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const TextFieldForHook = (props) => {
  const { name, control, rules, notEmpty, ...otherProps } = props;
  const checkNotEmpty = (value) => value.trim().length > 0;
  const { field } = useController({
    name,
    control,
    rules: { ...rules, validate: notEmpty ? checkNotEmpty : null },
  });

  const { t } = useTranslation();
  return (
    <Box sx={{ my: 1 }}>
      <InputLabel htmlFor={name}>{t(name)}</InputLabel>
      <TextField
        {...otherProps}
        fullWidth
        autoComplete="off"
        type="text"
        id={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        name={field.name}
        inputRef={field.ref}
      />
    </Box>
  );
};

const RadioGroupForHook = ({ control }) => {
  const { t } = useTranslation();
  return (
    <Controller
      render={({ field }) => (
        <RadioGroup row {...field}>
          <FormControlLabel value="bug" control={<Radio />} label={t('bug')} />
          <FormControlLabel
            value="suggestion"
            control={<Radio />}
            label={t('suggestion')}
          />
          <FormControlLabel
            value="other"
            control={<Radio />}
            label={t('Other')}
          />
        </RadioGroup>
      )}
      name="type"
      control={control}
    />
  );
};

export const ReportForm = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [helperText, setHelperText] = useState('');

  const { t } = useTranslation();
  const formRef = useRef(null);

  const { handleSubmit, control, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      link: '',
      content: '',
      type: 'bug',
    },
  });
  const formSubmit = handleSubmit(async (data) => {
    setIsWaiting(true);

    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(data),
    };
    myLog(requestOptions);

    const result = await fetch(postFormApi, requestOptions)
      .then((response) => response.json())
      .catch((error) => {
        myLog('error', error);
        setHelperText(`⚠️ it's not working, please try again later`);
      });

    myLog(result);
    if (result.status === 'success') {
      reset();
      setIsWaiting(false);
      setIsSuccess(true);
    }
  });

  if (isSuccess)
    return (
      <Paper
        elevation={2}
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '500px',
          m: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CheckCircle sx={{ color: 'success.main', fontSize: '35px' }} />
          <Typography sx={{ color: 'success.main' }} variant="h4">
            success
          </Typography>
        </Box>
      </Paper>
    );
  return (
    <Paper
      ref={formRef}
      component="form"
      sx={{ m: 3, p: 4, border: '1px solid lightgrey', position: 'relative' }}
      elevation={2}
      onSubmit={formSubmit}
    >
      <TextFieldForHook
        name="title"
        control={control}
        rules={{ required: true, maxLength: 350 }}
        notEmpty={true}
        disabled={isWaiting}
      />
      <Box sx={{ my: 1 }}>
        <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
          {t('type')}
        </Typography>
        <RadioGroupForHook control={control} />
      </Box>
      <TextFieldForHook name="link" control={control} disabled={isWaiting} />
      <TextFieldForHook
        name="content"
        control={control}
        multiline
        minRows={4}
        rules={{ required: true, maxLength: 2500 }}
        notEmpty={true}
        disabled={isWaiting}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography
          sx={{ px: 2, mr: 2, color: 'error.main' }}
          variant="subtitle1"
        >
          {helperText}
        </Typography>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: '200px' }}
          disabled={isWaiting}
        >
          {t('Submit')}
        </Button>
      </Box>
    </Paper>
  );
};
