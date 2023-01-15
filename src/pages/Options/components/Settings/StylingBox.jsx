import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from 'react';
import {
  allStyles,
  getTextStyleData,
} from '../../../../utilsForAll/textStyleData';

const useStorageTextStyle = () => {
  const [textStyle, setTextStyle] = useState(getTextStyleData('default'));
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
    const newData = getTextStyleData(newStyleName);
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

  return (
    <FormControl sx={{ marginX: 'auto', mt: 1 }}>
      <FormLabel sx={{ textAlign: 'center' }}>Text Style</FormLabel>
      <RadioGroup defaultValue={defaultValue} onChange={handleChange} row>
        {Object.keys(allStyles).map((styleName) => (
          <FormControlLabel
            key={styleName}
            value={styleName}
            label={
              <Typography sx={getTextStyleData(styleName).styles}>
                {styleName}
              </Typography>
            }
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
          // width: '400px',
          backgroundColor: bgColor,
          color: color,
          p: 2,
        }}
      >
        In publishing and graphic design,{' '}
        <FakeHooliText>Lorem ipsum</FakeHooliText> is a placeholder text
        commonly used to demonstrate the visual form of a document or a typeface
        without relying on meaningful content.
      </Box>
    );
  };

  const basicColorPair = {
    white: 'black',
    black: 'white',
    '#001E3C': '#b2bac2',
    '#f7f5ef': 'black',
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grid2 container sx={{ boxShadow: 2, borderRadius: 2 }}>
        {Object.entries(basicColorPair).map(([bgColor, color]) => (
          <Grid2 xs={12} sm={6} key={bgColor}>
            <DummyTextBox bgColor={bgColor} color={color} />
          </Grid2>
        ))}
      </Grid2>
      <StylePanel
        defaultValue={defaultValue}
        changeTextStyle={changeTextStyle}
      />
    </Box>
  );
};
