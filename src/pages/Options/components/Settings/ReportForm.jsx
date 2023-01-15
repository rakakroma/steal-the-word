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
import React, { useRef } from 'react';
import { myLog } from '../../../Content/utils/customLogger';

const postFormApi = `https://script.google.com/macros/s/AKfycbzTWZ3n1QjuRx_8GvDkjkIlBg-eqXJ_HmVoDsP-OWhDB8_2OX_J3MkjMZ2Sa1pCT5-J/exec`;
export const ReportForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    //title, type, link, content
    const formData = new FormData(formRef.current);
    for (const [key, value] of formData.entries()) {
      myLog(`${key}: ${value}`);
    }
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(Object.fromEntries(formData)),
    };
    myLog(requestOptions);

    fetch(postFormApi, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  const formRef = useRef(null);
  return (
    <Paper
      ref={formRef}
      component="form"
      sx={{ m: 3, p: 2, border: '1px solid lightgrey' }}
      elevation={2}
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        Report Form
      </Typography>
      <Box sx={{ my: 1 }}>
        <InputLabel htmlFor="title">Title</InputLabel>
        <TextField
          id="title"
          name="title"
          fullWidth
          autoComplete="off"
          required
          type="text"
          inputProps={{ maxLength: 350 }}
        />
      </Box>
      <Box sx={{ my: 1 }}>
        <Typography>Form Type</Typography>
        <RadioGroup row name="type" defaultValue={'bug'}>
          <FormControlLabel value="bug" control={<Radio />} label="bug" />
          <FormControlLabel
            value="suggestion"
            control={<Radio />}
            label="suggestion"
          />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </Box>
      <Box sx={{ my: 1 }}>
        <InputLabel htmlFor="link">Link (If needed)</InputLabel>
        <TextField id="link" name="link" fullWidth autoComplete="off" />
      </Box>
      <Box sx={{ my: 1 }}>
        <InputLabel htmlFor="content">Content</InputLabel>
        <TextField
          id="content"
          name="content"
          multiline
          minRows={4}
          fullWidth
          autoComplete="off"
          required
          inputProps={{ maxLength: 2500 }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" sx={{ width: '200px' }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
};
