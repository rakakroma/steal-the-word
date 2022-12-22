import { Stack, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

const Option = ({ description, checked, handleChange, disabled }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">{description}</Typography>

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

  const NotMainOption = ({ name }) => {
    return (
      <Option
        description={camelCaseToSpaced(name)}
        checked={globalPreference[name]}
        handleChange={() => toggleGlobalPreference(name)}
        disabled={!globalPreference.activate}
      />
    );
  };
  return (
    <Stack>
      <NotMainOption name={'floatingWindow'} />
      <NotMainOption name={'mouseTool'} />
      <Option
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
  const { domainData, toggleOneDomainData, setAll } = domainDataAndMethods;
  const { globalPreference } = localStorageDataAndMethods;

  const SecondaryOption = ({ name }) => {
    return (
      <Option
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
      <Option
        description="Use Custom Setting in Current Site?"
        checked={domainData.customRule || false}
        handleChange={() => {
          toggleOneDomainData('customRule');
        }}
        disabled={!globalPreference.activate}
      />

      <SecondaryOption name="floatingWindow" />
      <SecondaryOption name="mouseTool" />
      <Option
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
