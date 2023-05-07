import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import React, { useContext } from 'react';
import { WordInfoDrawerContext, WordListContext } from '../../../allContext';
import { useMediaQuery } from '@mui/material';
import { useRegisterActions } from 'kbar';
import '../../../../Content/components/customElements/WordBlock/HooliHighlighter';
import { wordListInAlphabeticalOrder } from '../../../utils/transformData';
import { AppBar } from '../../AppBar/AppBar';
import { CurrentWordInfo } from './CurrentWordInfo';
import { HideDrawerButton } from './HideDrawerButton';
import { useTranslation } from 'react-i18next';

const drawerWidth = 390;
export const drawerDirectionBreakpoint = 'md';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    padding: theme.spacing(3),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

export default function PersistentDrawerRight(props) {
  const { wordInfoTarget, changeWordInfoTarget, handleWordClick } = useContext(
    WordInfoDrawerContext
  );
  const { t } = useTranslation();

  const theme = useTheme();
  const matches = useMediaQuery(
    theme.breakpoints.up(drawerDirectionBreakpoint)
  );

  const open = wordInfoTarget?.wordId?.length > 0;

  const wordList = useContext(WordListContext);
  useRegisterActions(
    wordList
      ? wordListInAlphabeticalOrder(wordList).map((wordObj) => {
          return {
            type: 'word',
            id: wordObj.id,
            name: wordObj.word,
            subtitle: wordObj.definitions[0].annotation,
            perform: () => handleWordClick({ wordId: wordObj.id }),
            section: t('search'),
            parent: 'word-search',
          };
        })
      : [],
    [wordList]
  );
  //context data cause performance issue in KBar, when typing multiple characters in input.
  // useRegisterActions(
  //   contextList
  //     ? contextList.map((contextObj) => {
  //         return {
  //           type: 'context',
  //           id: contextObj.id,
  //           name: contextObj.context,
  //           subtitle: contextObj.word,
  //           perform: () => handleWordClick({ wordId: contextObj.wordId }),
  //           section: 'contexts',
  //           parent: 'context-search',
  //         };
  //       })
  //     : [],
  //   [contextList]
  // );

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar open={matches ? open : false} drawerWidth={drawerWidth} />
      <Main open={open}>{props.children}</Main>
      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: matches ? drawerWidth : '100%',
            overflowX: 'hidden',
          },
        }}
        variant="persistent"
        anchor={matches ? 'right' : 'bottom'}
        open={open}
      >
        <HideDrawerButton />
        <Divider />
        <CurrentWordInfo />
      </Drawer>
    </Box>
  );
}
