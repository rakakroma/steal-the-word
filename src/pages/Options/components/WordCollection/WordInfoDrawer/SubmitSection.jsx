import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const SubmitSection = ({
  controlMode,
  setControlMode,
  disableSubmit,
  handleCloseEdit,
  onlyOneContext,
  defaultData,
}) => {
  const [deleteHelperText, setDeleteHelperText] = useState(
    onlyOneContext
      ? 'delete all info here '
      : 'check the content you want to delete'
  );
  const theme = useTheme();

  const { reset, watch } = useFormContext();

  const noObjToDelete =
    controlMode === 'delete' &&
    Object.values(watch()).findIndex((value) => value === true) === -1;

  const handleToDeleteMode = () => {
    const deleteDefault = { word: false };
    const allContextNames = Object.keys(defaultData).filter((keyName) =>
      keyName.startsWith('context**')
    );
    allContextNames.forEach((name) => {
      deleteDefault[name] = false;
    });
    reset(deleteDefault);
    setControlMode('delete');
  };

  const handleToEditMode = () => {
    reset(defaultData);
    setControlMode('edit');
  };

  if (controlMode === 'display') {
    return (
      <>
        <IconButton onClick={handleToEditMode}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleToDeleteMode}>
          <Delete />
        </IconButton>
      </>
    );
  }

  if (controlMode === 'delete') {
    return (
      <Box>
        <Button
          sx={{ ml: 1 }}
          size="small"
          variant="outlined"
          onClick={() => setControlMode('display')}
        >
          Cancel
        </Button>
        <Button
          sx={{ ml: 1 }}
          size="small"
          variant="contained"
          type="submit"
          disabled={onlyOneContext ? false : noObjToDelete}
        >
          Delete
        </Button>
        <Typography sx={{ color: theme.palette.warning.main }}>
          {deleteHelperText}
        </Typography>
      </Box>
    );
  }
  if (controlMode === 'edit') {
    return (
      <Box>
        <Button color="secondary" onClick={handleCloseEdit} sx={{ ml: 1 }}>
          Cancel
        </Button>
        <Button
          sx={{ ml: 1 }}
          type="submit"
          color="primary"
          variant="contained"
          disabled={disableSubmit}
        >
          Submit
        </Button>
      </Box>
    );
  }
};
