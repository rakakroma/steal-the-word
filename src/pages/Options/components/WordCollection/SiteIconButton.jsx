import { Avatar, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { cutUrl } from '../../utils/transformData';
import { PublicTwoTone } from '@mui/icons-material';

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

  const [gotImg, setGotImg] = useState(true);

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
      {gotImg ? (
        <img
          src={iconUri}
          height={iconSize}
          width={iconSize}
          alt=""
          loading="lazy"
          onError={({ currentTarget }) => {
            setGotImg(false);
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = '';
          }}
        />
      ) : (
        <PublicTwoTone fontSize="small" />
      )}
    </IconButton>
  );
};
