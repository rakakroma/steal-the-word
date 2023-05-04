import { Stack, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SingleOption = ({ description, checked, handleChange, disabled }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">{t(description)}</Typography>

      <Switch checked={checked} onChange={handleChange} disabled={disabled} />
    </Box>
  );
};

const camelCaseToSpaced = (str) => {
  //thank u ChatGPT
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // add spaces between words
    .replace(/^./, (char) => char.toUpperCase()); // capitalize first character
};

export const AllSitesToggleOptions = ({ localStorageDataAndMethods }) => {
  const { globalPreference, toggleGlobalPreference } =
    localStorageDataAndMethods;

  const SecondaryOptionInAllSites = ({ name }) => {
    return (
      <SingleOption
        description={camelCaseToSpaced(name)}
        checked={globalPreference[name]}
        handleChange={() => toggleGlobalPreference(name)}
        disabled={!globalPreference.activate}
      />
    );
  };
  return (
    <Stack>
      <SecondaryOptionInAllSites name="floatingWindow" />
      <SecondaryOptionInAllSites name="mouseTool" />
      <SingleOption
        description="Activate"
        checked={globalPreference.activate}
        handleChange={() => toggleGlobalPreference('activate')}
      />
    </Stack>
  );
};

export const CurrentSiteToggleOptions = ({
  domainDataAndMethods,
  localStorageDataAndMethods,
}) => {
  const { domainData, toggleOneDomainData } = domainDataAndMethods;
  const { globalPreference } = localStorageDataAndMethods;

  const SecondaryOptionInCurrentSite = ({ name }) => {
    return (
      <SingleOption
        description={camelCaseToSpaced(name)}
        checked={domainData[name] || false}
        handleChange={() => toggleOneDomainData(name)}
        disabled={
          !domainData.customRule ||
          !globalPreference.activate ||
          !domainData.activate ||
          !globalPreference[name]
        }
      />
    );
  };

  return (
    <Stack>
      <SingleOption
        description="Use Custom Setting in Current Site?"
        checked={domainData.customRule || false}
        handleChange={() => {
          toggleOneDomainData('customRule');
        }}
        disabled={!globalPreference.activate}
      />

      <SecondaryOptionInCurrentSite name="floatingWindow" />
      <SecondaryOptionInCurrentSite name="mouseTool" />
      <SingleOption
        description="Activate"
        checked={domainData['activate'] || false}
        handleChange={() => {
          toggleOneDomainData('activate');
        }}
        disabled={!domainData.customRule || !globalPreference.activate}
      />
    </Stack>
  );
};
