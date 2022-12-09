import { Box, IconButton, styled, useTheme } from '@mui/material';
import React, { useState, useRef } from 'react';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { useIsOverflow } from '../../utils/customHook';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const IndexQuickRefBox = (props) => {
  const [expanding, setExpanding] = useState(false);
  const quickIndexBoxRef = useRef(null);
  const isOverflow = useIsOverflow(quickIndexBoxRef);

  const theme = useTheme();
  return (
    <Box
      ref={quickIndexBoxRef}
      sx={{
        margin: theme.spacing(1),
        // boxShadow: theme.shadows[1],
        borderRadius: theme.shape.borderRadius,
        //FIXME: use theme.shape.borderRadius should be 4px but show 16px, why?
        overflow: expanding ? 'scroll' : 'hidden',
        height: expanding ? 'auto' : '37px',
        maxHeight: '25vh',
        //animation seems not work but don't know why
        transition: theme.transitions.create(['height'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {(isOverflow || expanding) && (
        <ExpandMore expand={expanding} onClick={() => setExpanding(!expanding)}>
          <ExpandMoreOutlined />
        </ExpandMore>
      )}
      {props.children}
    </Box>
  );
};
