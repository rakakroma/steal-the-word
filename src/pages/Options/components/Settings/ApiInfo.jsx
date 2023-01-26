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
import { Trans, useTranslation } from 'react-i18next';
import i18next from 'i18next';

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

  const { t } = useTranslation();
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
        <Trans i18nKey="japaneseHiraganaApi" components={{ bold: <strong /> }}>
          <strong>Japanese</strong> Hiragana from from
        </Trans>
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
        <Trans i18nKey="englishDictApi" components={{ bold: <strong /> }}>
          <strong>English word</strong> pronunciation and its first definition
          from
        </Trans>
        <Link href="https://dictionaryapi.dev/" target="_blank">
          Free Dictionary API
        </Link>
      </Typography>
    ),
    chinese: (
      <Typography>
        <Trans i18nKey="chineseApi" components={{ bold: <strong /> }}>
          word pronunciation of other languages (in Taiwan) using
          <strong>Traditional Chinese characters</strong> from
        </Trans>
        <Link href="https://github.com/g0v/moedict-webkit" target="_blank">
          MOEDICT 萌典
        </Link>
      </Typography>
    ),
  };
  const handleLanguageChange = (e) => {
    i18next.changeLanguage(e.target.value);
  };
  return (
    <Box>
      <FormControl sx={{ mb: 3, display: 'flex', flexDirection: 'row' }}>
        <Typography
          variant="h6"
          sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
        >
          {t('Language')}:
        </Typography>
        <Select
          sx={{ maxWidth: '200px' }}
          value={i18next.language}
          onChange={handleLanguageChange}
        >
          {Object.entries({
            en: 'English',
            'zh-TW': '繁體中文',
            ja: '日本語',
          }).map(([keyId, value]) => (
            <MenuItem key={keyId} value={keyId}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper elevation={3} sx={{ p: 2, mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              onChange={() => changeOneOption({ enabled: !enabled })}
              checked={enabled}
            />
          }
          label={t('enable auto retrieve info from api')}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          ❗{t('api_caution')}
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
                  {t(value)}
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
