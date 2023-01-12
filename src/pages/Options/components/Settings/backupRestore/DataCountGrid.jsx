import { Box, Typography } from '@mui/material';
import React from 'react';
import { SingleDataInfo } from './SingleDataInfo';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import styled from '@emotion/styled';

export const DataCountGrid = ({
  title,
  listLengthData,
  deleteDecoration,
  isImportedData,
}) => {
  return (
    <Box>
      <Typography variant="subtitle1">{title}</Typography>
      <Grid2
        container
        rowSpacing={2}
        columns={{ xs: 2, sm: 4, md: 8 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ my: 2 }}
      >
        {Object.entries(listLengthData).map((pair) => (
          <Grid2 xs={2} key={pair[0]}>
            <SingleDataInfo
              title={pair[0]}
              number={pair[1]}
              deleteDecoration={deleteDecoration}
              isImportedData={isImportedData}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};
export const ButtonContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',

  '.main-button': {
    flexGrow: 4,
    marginRight: theme.spacing(1),
  },
}));
