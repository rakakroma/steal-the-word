import React from 'react';

import { useTheme } from '@emotion/react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DomainIcon from '@mui/icons-material/Domain';
import TagIcon from '@mui/icons-material/Tag';
import { ContainerQueryWrapper } from '../WordCollection';
import { useContainerQuery } from 'react-container-query';
import { useEffect } from 'react';

export const ControlOrderToggle = ({ orderMode, setOrderMode }) => {
  const theme = useTheme();

  const handleChange = (event, newOrderMode) => {
    if (!newOrderMode) return;
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
        time
      </ToggleButton>
      <ToggleButton value="timeSite">
        <DomainIcon />
        Site
      </ToggleButton>
      <ToggleButton value="alphabeticalOrder">
        <SortByAlphaIcon />
        alphabetical
      </ToggleButton>
      <ToggleButton value="tags">
        <TagIcon />
        tags
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
