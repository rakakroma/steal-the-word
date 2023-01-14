import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const allStyles = {
  default: {
    color: 'white',
    background: 'slategray',
  },
  style1: {
    color: 'black',
    background: '#d8d8d8',
  },
  style2: {
    color: 'white',
    background: 'linear-gradient(to right, #F27121cc, #E94057cc, #8A2387cc)',
  },
  style3: {
    background: 'linear-gradient(transparent 20%, #eea3a361 30%)',
  },
};

const useStorageTextStyle = () => {
  const [textStyle, setTextStyle] = useState({
    styleName: 'default',
    styles: allStyles.default,
  });
  const [defaultValue, setDefaultValue] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(['textStyle'], (obj) => {
      const textStyleData = obj.textStyle;
      if (textStyleData && Object.keys(textStyleData).length > 0) {
        setTextStyle(textStyleData);
        setDefaultValue(textStyleData.styleName);
        return;
      }
      setDefaultValue('default');
    });
  }, []);

  const changeTextStyle = (newStyleName) => {
    const newData = {
      styleName: newStyleName,
      styles: allStyles[newStyleName],
    };
    chrome.storage.local.set({
      textStyle: newData,
    });
    setTextStyle(newData);
  };

  return { defaultValue, textStyle, changeTextStyle };
};

const StylePanel = ({ defaultValue, changeTextStyle }) => {
  const handleChange = (e) => {
    changeTextStyle(e.target.value);
  };

  // if (!selectedStyle) return null;
  return (
    <FormControl>
      <FormLabel>Text Style</FormLabel>
      <RadioGroup defaultValue={defaultValue} onChange={handleChange} row>
        {Object.keys(allStyles).map((styleName) => (
          <FormControlLabel
            key={styleName}
            value={styleName}
            label={styleName}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const StylingBox = () => {
  const { defaultValue, textStyle, changeTextStyle } = useStorageTextStyle();

  if (!defaultValue) return null;
  const FakeHooliText = (props) => {
    return (
      <span style={{ cursor: 'pointer', ...textStyle.styles }}>
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
        defaultValue={defaultValue}
        changeTextStyle={changeTextStyle}
      />
    </Box>
  );
};
