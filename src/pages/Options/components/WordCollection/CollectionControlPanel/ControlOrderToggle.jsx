import React from 'react';

import { useTheme } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DomainIcon from '@mui/icons-material/Domain';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import TagIcon from '@mui/icons-material/Tag';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ControlOrderToggle = ({ orderMode, setOrderMode }) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const handleChange = (event, newOrderMode) => {
    if (!newOrderMode) return;
    document.cookie = `orderMode=${newOrderMode}`;
    setOrderMode(newOrderMode);
  };

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={orderMode}
      exclusive
      onChange={handleChange}
      sx={{ bgcolor: theme.palette.background.paper }}
    >
      <ToggleButton value="time">
        <AccessTimeIcon />
        {t('time')}
      </ToggleButton>
      <ToggleButton value="timeSite">
        <DomainIcon />
        {t('Site')}
      </ToggleButton>
      <ToggleButton value="alphabeticalOrder">
        <SortByAlphaIcon />
        {t('alphabetical')}
      </ToggleButton>
      <ToggleButton value="tags">
        <TagIcon />
        {t('tags_order')}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
