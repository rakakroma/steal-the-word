import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from 'react';
import {
  allStyles,
  getTextStyleData,
} from '../../../../utilsForAll/textStyleData';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <FormControl sx={{ marginX: 'auto', mt: 1 }}>
      <FormLabel sx={{ textAlign: 'center' }}>{t('Text Style')}</FormLabel>
      <RadioGroup defaultValue={defaultValue} onChange={handleChange} row>
        {Object.keys(allStyles).map((styleName) => (
          <FormControlLabel
            key={styleName}
            value={styleName}
            label={
              <Typography sx={getTextStyleData(styleName).styles}>
                {t(styleName)}
              </Typography>
            }
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const FakeHooliText = ({ textStyle, children }) => {
  return (
    <span style={{ cursor: 'pointer', ...textStyle.styles }}>{children}</span>
  );
};

const DummyTextBox = ({ bgColor, color, textStyle }) => {
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
      <FakeHooliText textStyle={textStyle}>Lorem ipsum</FakeHooliText> is a
      placeholder text commonly used to demonstrate the visual form of a
      document or a typeface without relying on meaningful content.
    </Box>
  );
};

export const StylingBox = () => {
  const { defaultValue, textStyle, changeTextStyle } = useStorageTextStyle();

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
            <DummyTextBox
              bgColor={bgColor}
              color={color}
              textStyle={textStyle}
            />
          </Grid2>
        ))}
      </Grid2>
      {defaultValue ? (
        <StylePanel
          defaultValue={defaultValue}
          changeTextStyle={changeTextStyle}
        />
      ) : (
        <Skeleton variant="rectangular" height={30} />
      )}
    </Box>
  );
};
