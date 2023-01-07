import React from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

export const DateOfContext = ({ date }) => {
  const content = dayjs(date).isSame(dayjs(), 'year')
    ? dayjs(date).format('MMM D')
    : dayjs(date).format('MMM D,YY');
  return (
    <Typography
      component="span"
      sx={{ color: 'text.secondary', fontSize: '12px' }}
    >
      {content}
    </Typography>
  );
};
