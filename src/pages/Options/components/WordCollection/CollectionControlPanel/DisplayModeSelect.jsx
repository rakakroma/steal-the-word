import { MenuItem, Select } from '@mui/material';
import React from 'react';

export const DisplayModeSelect = ({ setDisplayMode, displayMode }) => {
  const handleDisplayModeChange = (e) => {
    setDisplayMode(e.target.value);
  };

  return (
    <Select size="small" onChange={handleDisplayModeChange} value={displayMode}>
      <MenuItem value="word">word</MenuItem>
      <MenuItem value="phrase">phrase</MenuItem>
      <MenuItem value="context">context</MenuItem>
    </Select>
  );
};
