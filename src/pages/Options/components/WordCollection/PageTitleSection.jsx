import { Link, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext } from 'react';
import { OrderModeANdSiteTargetContext } from '../../Options';
import { SiteIconButton } from './SiteIconButton';
import { getHostName } from '../../utils/transformData';

export const PageTitleSection = ({ pageTitle, imgUri, linkUrl, noIcon }) => {
  const { toCertainSite } = useContext(OrderModeANdSiteTargetContext);

  const domainName = getHostName(linkUrl);
  return (
    <Box sx={{ display: 'flex' }}>
      {!noIcon && (
        <SiteIconButton
          domainName={domainName}
          iconUri={imgUri}
          onClick={() => {
            toCertainSite(linkUrl);
          }}
          iconSize={20}
        />
      )}
      <Tooltip title={pageTitle} placement="right" arrow disableInteractive>
        <Link
          href={linkUrl}
          target="_blank"
          variant="body2"
          underline="hover"
          sx={{
            pl: '2px',
            display: 'inline-block',
            color: 'text.secondary',
            height: '1.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: 'none',
          }}
        >
          {pageTitle}
        </Link>
      </Tooltip>
    </Box>
  );
};
