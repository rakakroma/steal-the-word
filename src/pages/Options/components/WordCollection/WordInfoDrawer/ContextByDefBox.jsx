import React, { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { SiteIconButton } from '../SiteIconButton';
import { Tooltip, Typography, useMediaQuery } from '@mui/material';
import { TypographyOrInput } from './inputs/TypographyOrInput';
import { useIsOverflow } from '../../../utils/customHook';
import { getName } from './getDataFromName';
import styled from '@emotion/styled';
import { useFormContext } from 'react-hook-form';
import { pink, red } from '@mui/material/colors';
import dayjs from 'dayjs';
import { HighlightableContext } from './HighlightableContext';

const PageTitleAndLink = styled(Box)(({ theme }) => ({
  fontSize: '0.8rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  maxHeight: '2.1rem',
  lineHeight: '1rem',
  textOverflow: 'ellipsis',
}));

export const ContextDate = ({ date }) => {
  const content = dayjs(date).isSame(dayjs(), 'year')
    ? dayjs(date).format('MMM D')
    : dayjs(date).format('MMM D,YY');
  return (
    <Typography
      component="span"
      sx={{ color: 'text.secondary', fontSize: '12px' }}
    >
      {content}
    </Typography>
  );
};

export const ContextByDefBox = ({ contextObj, allMatchText, controlMode }) => {
  const theme = useTheme();

  const matchTexts = allMatchText.filter(
    (matchText) => contextObj.context.indexOf(matchText) > -1
  );
  const pageTitleRef = useRef(null);
  const isOverflow = useIsOverflow(pageTitleRef);
  // const biggerThan600px = useMediaQuery('(min-width:600px)');
  const breakpointOfDirectionChange = useMediaQuery('(min-width:700px)');
  const tooltipPlacement = breakpointOfDirectionChange ? 'left-start' : 'top';

  const nameForForm = getName('context', contextObj.id, false);
  const { watch } = useFormContext();
  const isDeleting =
    controlMode === 'delete' &&
    watch(nameForForm) === true &&
    watch('word') === false;

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
        {isOverflow ? (
          <Tooltip title={contextObj.pageTitle} placement={tooltipPlacement}>
            <PageTitleAndLink ref={pageTitleRef}>
              <SiteIconButton
                pageTitle={contextObj.pageTitle}
                iconUri={contextObj.icon}
                linkUrl={contextObj.url}
                iconSize={16}
              />
              {contextObj.pageTitle}
            </PageTitleAndLink>
          </Tooltip>
        ) : (
          <PageTitleAndLink ref={pageTitleRef}>
            <SiteIconButton
              iconUri={contextObj.icon}
              linkUrl={contextObj.url}
              iconSize={16}
            />
            {contextObj.pageTitle}
          </PageTitleAndLink>
        )}
      </Box>
    </Box>
  );
};
