import { PublicTwoTone } from '@mui/icons-material';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { cutUrl } from '../../utils/transformData';
import { useTranslation } from 'react-i18next';
export const SiteIconAvatar = ({ imgSrc, linkUrl }) => {
  return (
    <Avatar
      sx={{ width: 20, height: 20 }}
      alt={cutUrl(linkUrl)[0]}
      src={imgSrc}
    />
  );
};

const ImgEle = ({ isCircle, iconUri, iconSize }) => {
  const [gotImg, setGotImg] = useState(true);

  if (gotImg) {
    return (
      <img
        style={{
          filter: 'drop-shadow(lightgray 1px 2px 2px)',
          borderRadius: isCircle && '9px',
        }}
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
    );
  }

  return <PublicTwoTone fontSize="small" />;
};

export const SiteIconButton = ({
  domainName,
  iconUri,
  linkUrl,
  iconSize,
  isCircle,
  onClick,
}) => {
  const { t } = useTranslation();
  if (linkUrl) {
    return (
      <IconButton
        LinkComponent="a"
        href={linkUrl}
        target="_blank"
        sx={{
          height: `${iconSize}px`,
          width: `${iconSize}px`,
          fontSize: '14px',
          mr: 1,
        }}
      >
        <ImgEle isCircle={isCircle} iconUri={iconUri} iconSize={iconSize} />
      </IconButton>
    );
  }

  return (
    <Tooltip
      title={
        t('see-collection-before') +
        ' ' +
        domainName +
        t('see-collection-after')
      }
      disableInteractive
      arrow
      placement="top"
    >
      <IconButton
        onClick={onClick}
        sx={{
          height: `${iconSize}px`,
          width: `${iconSize}px`,
          fontSize: '14px',
          mr: 1,
        }}
      >
        <ImgEle isCircle={isCircle} iconUri={iconUri} iconSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};
