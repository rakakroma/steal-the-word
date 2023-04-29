import { Box, Typography } from '@mui/material';
import React from 'react';

export const ListSubTitle = ({ content, fontSize, isUrl }) => {
  return (
    <Box>
      <fieldset
        style={{
          border: 'none',
          borderTop: '1px solid #4a4a4a36',
          maxWidth: '750px',
          paddingLeft: 0,
          marginBottom: '4px',
          paddingBottom: '2px',
        }}
      >
        <legend>
          <Typography
            variant="subtitle1"
            component="span"
            color={'#7f7f7f'}
            sx={{
              fontSize: fontSize || 'inherit',
              display: 'flex',
              maxWidth: '500px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.9rem',
            }}
          >
            {content}
          </Typography>
        </legend>
      </fieldset>
    </Box>
  );
};
