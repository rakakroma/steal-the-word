import { MenuItem, Select } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const DisplayModeSelect = ({ setDisplayMode, displayMode }) => {
  const handleDisplayModeChange = (e) => {
    setDisplayMode(e.target.value);
  };

  const { t } = useTranslation();

  return (
    <Select size="small" onChange={handleDisplayModeChange} value={displayMode}>
      <MenuItem value="word">{t('word')}</MenuItem>
      <MenuItem value="phrase">{t('phrase')}</MenuItem>
      <MenuItem value="context">{t('context')}</MenuItem>
    </Select>
  );
};
