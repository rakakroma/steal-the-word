import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Link,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import {
  allChineseOptions,
  allHakOptions,
  defaultLangOptions,
} from '../../../../utilsForAll/languageAndApiData';

const useStorageApiSetting = () => {
  const [apiSetting, setApiSetting] = useState(defaultLangOptions);

  useEffect(() => {
    chrome.storage.local.get(['apiSetting'], (obj) => {
      const apiSettingData = obj.apiSetting;
      if (apiSettingData && Object.keys(apiSettingData).length > 0) {
        setApiSetting(apiSettingData);
        return;
      }
    });
  }, []);

  const changeWholeApiSetting = (newData) => {
    chrome.storage.local.set({
      apiSetting: newData,
    });
    setApiSetting(newData);
  };

  const changeOneOption = (keyValue) => {
    changeWholeApiSetting({ ...apiSetting, ...keyValue });
  };
  return { apiSetting, changeOneOption };
};

export const ApiInfo = () => {
  const { apiSetting, changeOneOption } = useStorageApiSetting();
  const langOptions = apiSetting;
  const enabled = apiSetting.enabled;

  const handleLangCheck = (e) => {
    changeOneOption({ [e.target.name]: e.target.checked });
  };

  const handleChineseChange = (e) => {
    changeOneOption({ chinese: e.target.value });
  };

  const handleHakOptionChange = (e) => {
    changeOneOption({ hakkaOptions: e.target.value });
  };

  const langLabels = {
    japanese: (
      <Typography>
        <b> Japanese</b> Hiragana from{' '}
        <Link
          href="https://labs.goo.ne.jp/api/jp/hiragana-translation/"
          target="_blank"
        >
          goo辞書ひらがな化API
        </Link>
      </Typography>
    ),
    english: (
      <Typography>
        <b>English</b> pronunciation and definition from{' '}
        <Link href="https://dictionaryapi.dev/" target="_blank">
          Free Dictionary API
        </Link>
      </Typography>
    ),
    chinese: (
      <Typography>
        pronunciation of other languages using <b>Chinese characters</b> from{' '}
        <Link href="https://github.com/g0v/moedict-webkit" target="_blank">
          MOEDICT 萌典
        </Link>
      </Typography>
    ),
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              onChange={() => changeOneOption({ enabled: !enabled })}
              checked={enabled}
            />
          }
          label="enable auto search by api"
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          ❗Using these api services must send the word and context you're
          searching to those service, and except for that, This app would not
          send any of your data to the web.
        </Typography>
      </Paper>

      <FormGroup>
        {['english', 'japanese'].map((langName) => (
          <FormControlLabel
            key={langName}
            control={
              <Checkbox
                checked={Boolean(langOptions[langName])}
                disabled={!enabled}
                onChange={handleLangCheck}
                name={langName}
              />
            }
            label={langLabels[langName]}
          />
        ))}
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(langOptions.chinese)}
              disabled={!enabled}
              onChange={(e) => {
                changeOneOption({
                  chinese: langOptions.chinese ? '' : 'nan-tw',
                });
              }}
              name={'chinese'}
            />
          }
          label={langLabels.chinese}
        />
        <FormControl sx={{ m: 1, maxWidth: 250 }}>
          <Select
            value={langOptions.chinese}
            onChange={handleChineseChange}
            disabled={!enabled || !langOptions.chinese}
            displayEmpty
          >
            {[['', 'None']]
              .concat(Object.entries(allChineseOptions))
              .map(([key, value]) => (
                <MenuItem value={key} key={key}>
                  {value}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {langOptions.chinese === 'hak' && (
          <FormControl sx={{ m: 1, maxWidth: 400 }}>
            <Select
              multiple
              value={langOptions.hakkaOptions}
              onChange={handleHakOptionChange}
            >
              {Object.entries(allHakOptions).map(([keyId, value]) => (
                <MenuItem key={keyId} value={keyId}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </FormGroup>
    </Box>
  );
};
