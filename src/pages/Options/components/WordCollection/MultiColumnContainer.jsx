import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const MultiColumnContainer = styled(Box)`
  columns: ${(props) => (props.showAnnotation ? 1 : '250px auto')};
  pl: '24px';
`;
