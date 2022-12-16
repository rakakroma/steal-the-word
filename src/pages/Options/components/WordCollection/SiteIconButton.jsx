import { Avatar, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { cutUrl } from '../../utils/transformData';

export const SiteIconAvatar = ({ imgSrc, linkUrl }) => {
  return (
    <Avatar
      sx={{ width: 20, height: 20 }}
      alt={cutUrl(linkUrl)[0]}
      src={imgSrc}
    />
  );
};

export const SiteIconButton = ({ iconUri, linkUrl, iconSize, pageTitle }) => {
  const theme = useTheme();

  const errorImg = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgaGVpZ2h0PSIzMiIgc3R5bGU9Im92ZXJmbG93OnZpc2libGU7ZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMiAzMiIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxnIGlkPSJFcnJvcl8xXyI+PGcgaWQ9IkVycm9yIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiBpZD0iQkciIHI9IjE2IiBzdHlsZT0iZmlsbDojRDcyODI4OyIvPjxwYXRoIGQ9Ik0xNC41LDI1aDN2LTNoLTNWMjV6IE0xNC41LDZ2MTNoM1Y2SDE0LjV6IiBpZD0iRXhjbGFtYXRvcnlfeDVGX1NpZ24iIHN0eWxlPSJmaWxsOiNFNkU2RTY7Ii8+PC9nPjwvZz48L2c+PC9zdmc+`;
  return (
    <IconButton
      LinkComponent="a"
      href={linkUrl}
      title={pageTitle}
      target="_blank"
      sx={{
        height: `${iconSize}px`,
        width: `${iconSize}px`,
        fontSize: '14px',
        mr: theme.spacing(1),
      }}
    >
      <img
        src={iconUri}
        height={iconSize}
        width={iconSize}
        alt=""
        loading="lazy"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = errorImg;
        }}
      />
    </IconButton>
  );
};
