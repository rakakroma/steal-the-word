import {
  Link,
  Box,
  Typography,
  Divider,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  styled,
} from '@mui/material';
import React, { useState } from 'react';
import { blue } from '@mui/material/colors';
import { Container } from '@mui/system';
import { CloudUpload } from '@mui/icons-material';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ImportAndExportBox } from './backupRestore/ImportAndExportBox';

const StylePanel = ({ selectedStyle, setSelectedStyle }) => {
  const handleChange = (e) => setSelectedStyle(e.target.value);
  return (
    <FormControl>
      <FormLabel>Text Style</FormLabel>
      <RadioGroup value={selectedStyle} onChange={handleChange}>
        <FormControlLabel value="default" control={<Radio />} label="default" />
        <FormControlLabel value="style1" control={<Radio />} label="style1" />
      </RadioGroup>
    </FormControl>
  );
};

const StylingBox = () => {
  const [selectedStyle, setSelectedStyle] = useState('default');

  const defaultStyle = {
    cursor: 'pointer',
    color: 'white',
    backgroundColor: 'slategray',
  };

  const style1 = {
    cursor: 'pointer',
    color: 'black',
    backgroundColor: '#d8d8d8',
  };
  const style2 = {
    cursor: 'pointer',
    backgroundImage:
      'linear-gradient(to right, #F27121cc, #E94057cc, #8A2387cc)',
  };

  const FakeHooliText = (props) => {
    return (
      <span style={selectedStyle === 'default' ? defaultStyle : style1}>
        {props.children}
      </span>
    );
  };

  const DummyTextBox = ({ bgColor, color }) => {
    return (
      <Box sx={{ width: '400px', backgroundColor: bgColor, color: color }}>
        Yes, I am familiar with <FakeHooliText>Lorem Ipsum</FakeHooliText>.
        <FakeHooliText>Lorem Ipsum</FakeHooliText> is a dummy text that is often
        used as a placeholder in the design and layout of documents, websites,
        and other visual media. It is a form of "greeked" text that is used to
        fill space in a document or page layout.{' '}
        <FakeHooliText>Lorem Ipsum</FakeHooliText> is derived from a work by the
        Roman philosopher and statesman Cicero, and it has been used as a
        placeholder text in the publishing and printing industries for
        centuries. The text is often used as a placeholder because it has a
        neutral appearance and does not distract the reader from the layout and
        design of the document or page. It is also used as a way to focus on the
        visual design of a document or page without being distracted by the
        content of the text.
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StylePanel
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />
      <DummyTextBox bgColor="black" color="white" />
      <DummyTextBox bgColor="white" color="black" />
    </Box>
  );
};

export const Settings = () => {
  return (
    <Box>
      <Typography variant="h4">Settings / Preferences</Typography>
      <Divider sx={{ marginY: 2 }} />
      <Typography variant="h5">Backup / Restore</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
        <ImportAndExportBox />
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Typography variant="h5">Style The Marked Text</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 7 }}>
        <StylingBox />
      </Box>
    </Box>
  );
};
