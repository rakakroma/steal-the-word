import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import React, { useContext } from 'react';
import {
  ContextListContext,
  WordInfoDrawerContext,
  WordListContext,
} from '../../../Options';
// import { db } from '../../Background/database.js';
// import { useLiveQuery } from 'dexie-react-hooks';
import { useMediaQuery } from '@mui/material';
import { useRegisterActions } from 'kbar';
import '../../../../Content/components/customElements/WordBlock/HooliHighlighter';
import { wordListInAlphabeticalOrder } from '../../../utils/transformData';
import { AppBar } from '../../AppBar/AppBar';
import { CurrentWordInfo } from './CurrentWordInfo';
import { HideDrawerButton } from './HideDrawerButton';

// const drawerWidth = 340;
const drawerWidth = 390;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: '100%',
    padding: theme.spacing(3),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function PersistentDrawerRight(props) {
  const theme = useTheme();
  const { wordInfoTarget, changeWordInfoTarget, handleWordClick } = useContext(
    WordInfoDrawerContext
  );
  // const biggerThan600px = useMediaQuery('(min-width:600px)');

  const breakpointOfDirectionChange = useMediaQuery('(min-width:700px)');

  const open = wordInfoTarget?.wordId?.length > 0;

  const handleDrawerClose = () => {
    // setOpen(false);
    changeWordInfoTarget(null);
  };

  const wordList = useContext(WordListContext);
  const contextList = useContext(ContextListContext);
  useRegisterActions(
    wordList
      ? wordListInAlphabeticalOrder(wordList).map((wordObj) => {
          return {
            type: 'word',
            id: wordObj.id,
            name: wordObj.word,
            subtitle: wordObj.definitions[0].annotation,
            perform: () => handleWordClick({ wordId: wordObj.id }),
            section: 'words',
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
      <AppBar
        open={breakpointOfDirectionChange ? open : false}
        drawerWidth={drawerWidth}
      />
      <Main open={open}>{props.children}</Main>
      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: breakpointOfDirectionChange ? drawerWidth : '100%',
            overflowX: 'hidden',
          },
        }}
        variant="persistent"
        anchor={breakpointOfDirectionChange ? 'right' : 'bottom'}
        open={open}
      >
        <HideDrawerButton />
        <Divider />
        <CurrentWordInfo />
      </Drawer>
    </Box>
  );
}
