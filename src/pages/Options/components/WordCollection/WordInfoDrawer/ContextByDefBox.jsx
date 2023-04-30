import styled from '@emotion/styled';
import { Link, Tooltip, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';
import React, { useContext, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { OrderModeANdSiteTargetContext } from '../../../Options';
import { useIsOverflow } from '../../../utils/customHook';
import { SiteIconButton } from '../SiteIconButton';
import { HighlightableContext } from './HighlightableContext';
import { getName } from './getDataFromName';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { getHostName } from '../../../utils/transformData';

const PageTitleAndLink = styled(Box)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  maxHeight: '2.1rem',
  lineHeight: '1rem',
  textOverflow: 'ellipsis',
}));

export const ContextByDefBox = ({ contextObj, allMatchText, controlMode }) => {
  const matchTexts = allMatchText.filter(
    (matchText) => contextObj.context.indexOf(matchText) > -1
  );
  const pageTitleRef = useRef(null);
  const isOverflow = useIsOverflow(pageTitleRef);
  const breakpointOfDirectionChange = useMediaQuery('(min-width:700px)');
  const tooltipPlacement = breakpointOfDirectionChange ? 'left-start' : 'top';

  const nameForForm = getName('context', contextObj.id, false);
  const { watch } = useFormContext();
  const isDeleting =
    controlMode === 'delete' &&
    watch(nameForForm) === true &&
    watch('word') === false;

  const { toCertainSite } = useContext(OrderModeANdSiteTargetContext);

  const CurrentPageTitle = () => (
    <Link
      href={contextObj.url}
      target="_blank"
      underline="hover"
      sx={{ color: 'text.secondary' }}
    >
      {' '}
      {contextObj.pageTitle}
    </Link>
  );
  return (
    <Box
      sx={{
        m: 1,
        backgroundColor: isDeleting ? red[50] : undefined,
      }}
    >
      <TypographyOrInput
        checkable={true}
        name={nameForForm}
        inputName="context"
        controlMode={controlMode}
        variant="subtitle2"
        sx={{
          lineHeight: 1.2,
          wordBreak: 'break-all',
        }}
        content={contextObj.context}
      >
        <HighlightableContext
          contextObj={contextObj}
          matchTexts={matchTexts}
          highlightable={controlMode === 'display'}
        />
      </TypographyOrInput>
      <Box>
        <PageTitleAndLink ref={pageTitleRef}>
          <SiteIconButton
            domainName={getHostName(contextObj.url)}
            iconUri={contextObj.icon}
            onClick={() => {
              toCertainSite(contextObj.url);
            }}
            iconSize={16}
          />
          {isOverflow ? (
            <Tooltip title={contextObj.pageTitle} placement={tooltipPlacement}>
              <CurrentPageTitle />
            </Tooltip>
          ) : (
            <CurrentPageTitle />
          )}
        </PageTitleAndLink>
      </Box>
    </Box>
  );
};
