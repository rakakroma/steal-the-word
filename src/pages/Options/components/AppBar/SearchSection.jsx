import { SearchOutlined } from '@mui/icons-material';
import { Box, ButtonBase, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useKBar } from 'kbar';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useUserAgentIsMacOS = () => {
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf('Mac OS X') !== -1) setIsMacOS(true);
  }, []);
  return isMacOS;
};
const ShortCutKey = ({ keyContent }) => {
  return (
    <Box
      sx={{
        fontSize: '0.75rem',
        fontWeight: '700',
        lineHeight: '20px',
        marginLeft: 'auto',
        marginRight: '3px',
        padding: '0px 8px',
        borderRadius: '5px',
        color: 'palette.primary.light',
      }}
    >
      {keyContent}
    </Box>
  );
};
export const SearchSection = () => {
  const theme = useTheme();
  const isMacOS = useUserAgentIsMacOS();

  const { query } = useKBar();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const { t } = useTranslation();
  return (
    <ButtonBase
      sx={{
        marginLeft: 'auto',
        minWidth: '95px',
        maxWidth: '350px',
        padding: '3px',
        display: 'flex',
        flexGrow: matches ? 1 : 0,
        alignItems: 'center',
      }}
      onClick={query.toggle}
    >
      <Box
        sx={{
          borderRadius: '8px',
          padding: '3px',
          backgroundColor: 'background.paper',
          width: '100%',
          height: '30px',
          display: 'flex',
          color: 'text.secondary',
          '&:hover': {
            outline: '1px solid gray',
          },
        }}
      >
        <SearchOutlined sx={{ color: 'palette.primary.light' }} />
        {matches && (
          <Typography
            sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {t('Search / Navigation')}
          </Typography>
        )}
        <ShortCutKey keyContent={isMacOS ? 'cmd+k' : 'ctrl+k'} />
      </Box>
    </ButtonBase>
  );
};
