import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Input,
} from '@mui/material';
import React, { useState } from 'react';

const allStyles = {
  default: {
    color: 'white',
    backgroundColor: 'slategray',
  },
  style1: {
    color: 'black',
    backgroundColor: '#d8d8d8',
  },
  style2: {
    color: 'white',
    backgroundImage:
      'linear-gradient(to right, #F27121cc, #E94057cc, #8A2387cc)',
  },
  style3: {
    background: 'linear-gradient(transparent 20%, #eea3a361 30%)',
  },
  style4: {
    color: '#5dffc4',
  },
};

const StylePanel = ({ selectedStyle, setSelectedStyle }) => {
  const handleChange = (e) => setSelectedStyle(e.target.value);

  return (
    <FormControl>
      <FormLabel>Text Style</FormLabel>
      <RadioGroup value={selectedStyle} onChange={handleChange} row>
        {Object.entries(allStyles).map((pair) => (
          <FormControlLabel
            key={pair[0]}
            value={pair[0]}
            label={pair[0]}
            control={<Radio />}
          />
        ))}{' '}
      </RadioGroup>
    </FormControl>
  );
};

export const StylingBox = () => {
  const [selectedStyle, setSelectedStyle] = useState('default');

  const FakeHooliText = (props) => {
    return (
      <span style={{ cursor: 'pointer', ...allStyles[selectedStyle] }}>
        {props.children}
      </span>
    );
  };

  const DummyTextBox = ({ bgColor, color }) => {
    return (
      <Box
        sx={{
          width: '400px',
          backgroundColor: bgColor,
          color: color,
          p: 2,
          // borderRadius: 2,
        }}
      >
        In publishing and graphic design,{' '}
        <FakeHooliText>Lorem ipsum</FakeHooliText> is a placeholder text
        commonly used to demonstrate the visual form of a document or a typeface
        without relying on meaningful content.
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          borderRadius: 2,
          display: 'flex',
          boxShadow: 2,
        }}
      >
        <Box>
          <DummyTextBox bgColor="black" color="white" />
          <DummyTextBox bgColor="white" color="black" />
        </Box>
        <Box>
          <DummyTextBox bgColor="#001E3C" color="#b2bac2" />
          <DummyTextBox bgColor="#f7f5ef" color="black" />
        </Box>
      </Box>
      <StylePanel
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />
    </Box>
  );
};
