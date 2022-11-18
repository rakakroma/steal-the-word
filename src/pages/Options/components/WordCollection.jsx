import Masonry from '@mui/lab/Masonry';
import { Box, Divider, Slider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { Highlighter } from './Highlighter';
import './smallWord.css';
// import relativeTime from 'dayjs/plugin/relativeTime'
import { domainPageWords, pagesWords } from '../utils/transformData';
import { WordCollectionPageBox } from './WordCollectionPageBox';

import { ContextListContext, DomainAndLinkListContext } from '../Options.jsx';

export const WordCollection = ({
  // domainAndLinkList,
  // contextList,
  handleSelectPhrase,
  // phraseMode,
  // timeMode,
  // alphabeticalOrderMode,
}) => {
  const [showingWord, setShowingWord] = useState(false);
  const [dateArrangement, setDateArrangement] = useState('date');

  const phraseMode = false;
  const alphabeticalOrderMode = false;
  const timeMode = false;

  const contextList = useContext(ContextListContext);
  const domainAndLinkList = useContext(DomainAndLinkListContext);

  if (!contextList || !domainAndLinkList) return <h1>nothing</h1>;

  const handleWordClick = (wordId) => {
    setShowingWord(contextList.find((wordObj) => wordObj.id === wordId));
  };

  const arrayWithUrlsByDateType = (datetype, words) => {
    return pagesWords(words).reduce((acc, currentValue) => {
      const dateData = dayjs(currentValue.words[0].date)
        .startOf(datetype)
        .format('YYYY/MM/DD');
      if (!acc.some((sortByDateData) => sortByDateData.dateData === dateData)) {
        return acc.concat({
          dateData: dateData,
          sortByUrlData: [currentValue],
        });
      }
      return acc.map((sortByDateData) => {
        if (sortByDateData.dateData === dateData) {
          sortByDateData.sortByUrlData = sortByDateData.sortByUrlData.concat([
            currentValue,
          ]);
        }
        return sortByDateData;
      });
    }, []);
  };

  const handleDateArrangementChange = (e, newValue) => {
    const sliderValue =
      newValue === 0
        ? 'date'
        : newValue === 1
        ? 'week'
        : newValue === 2
        ? 'month'
        : null;

    setDateArrangement(sliderValue);
  };

  // const wordListInDateOrder = arrayWithUrlsByDateType('date').reduce((acc, currentValue) => {
  //     const wordListInCurrentValue = currentValue.sortByUrlData.map(arrayWithUrl => {
  //         return arrayWithUrl[1]
  //     })
  //     return acc.concat(wordListInCurrentValue.flat())
  // }, [])

  // const wordListInGroupedListOrder = Object.values(groupedList).flat()

  // const handleToNextWord = useCallback(() => {
  //     const orderList = timeMode ? wordListInDateOrder : wordListInGroupedListOrder
  //     if (showingWord) {
  //         const currentOrderIndex = orderList.findIndex(wordObj => wordObj.id === showingWord.id)
  //         const nextOrderIndex = currentOrderIndex === orderList.length - 1 ?
  //             0 : currentOrderIndex + 1
  //         setShowingWord(orderList[nextOrderIndex])
  //     } else {
  //         setShowingWord(orderList[0])
  //     }
  // }, [showingWord, timeMode, wordListInDateOrder, wordListInGroupedListOrder])

  // const handleToLastWord = useCallback(() => {
  //     const orderList = timeMode ? wordListInDateOrder : wordListInGroupedListOrder
  //     if (showingWord) {
  //         const currentOrderIndex = orderList.findIndex(wordObj => wordObj.id === showingWord.id)
  //         const lastOrderIndex = currentOrderIndex === 0 ?
  //             orderList.length - 1 : currentOrderIndex - 1
  //         setShowingWord(orderList[lastOrderIndex])
  //     } else {
  //         setShowingWord(orderList[0])
  //     }
  // }, [showingWord, timeMode, wordListInDateOrder, wordListInGroupedListOrder])

  // const handleKeyDown = useCallback((e) => {
  //     if (e.key === 'ArrowRight') {
  //         handleToNextWord()
  //     } else if (e.key === 'ArrowLeft') {
  //         handleToLastWord()
  //     } else return
  // }, [handleToNextWord, handleToLastWord])

  // useEffect(() => {
  //     document.addEventListener('keydown', handleKeyDown)
  //     return () => document.removeEventListener('keydown', handleKeyDown)
  // }, [handleKeyDown])

  // const targetWordRef = useRef(null)

  // useEffect(() => {
  //     targetWordRef.current?.scrollIntoView({ block: "center", inline: "nearest" })
  // }, [showingWord])

  const myListInAlphabeticalOrder = [...contextList].sort((a, b) => {
    return a.word.localeCompare(b.word);
  });

  const regexHan = new RegExp(/\p{sc=Hani}/gu);
  const allFirstAlphabet = Array.from(
    new Set(myListInAlphabeticalOrder.map((wordObj) => wordObj.word[0]))
  ).filter((firstAlphabet) => !firstAlphabet.match(regexHan));

  const ControlDateArrangementSlider = () => {
    return (
      <Slider
        sx={{ width: '100px' }}
        defaultValue={0}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => {
          switch (value) {
            case 0:
              return '日';
            case 1:
              return '週';
            case 2:
              return '月';
            case 3:
              return '無';
            default:
              return;
          }
        }}
        step={1}
        marks
        min={0}
        max={3}
        onChange={handleDateArrangementChange}
      />
    );
  };

  const AlphabeticalOrderModeContainer = () => {
    return allFirstAlphabet.map((firstAlphabet) => {
      return (
        <React.Fragment key={`aaa-${firstAlphabet}`}>
          <Typography variant="h5">{firstAlphabet}</Typography>
          {myListInAlphabeticalOrder
            .filter((wordObj) => wordObj.word[0] === firstAlphabet)
            .map((wordObj, i) => {
              const lastWordObj =
                myListInAlphabeticalOrder.filter(
                  (wordObj) => wordObj.word[0] === firstAlphabet
                ).length -
                  1 ===
                i;
              return (
                <Box
                  sx={{
                    backgroundColor: 'background.light',
                    pl: '5px',
                    borderRadius:
                      i === 0 ? '3px 3px 0 0' : lastWordObj ? '0 0 3px 3px' : 0,
                    borderTopWidth: i === 0 ? 1 : 0,
                    borderBottomWidth: lastWordObj ? 1 : 0,
                    borderStyle: 'solid',
                    borderColor: 'black',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                  }}
                  key={`aaa-${wordObj.id}`}
                >
                  {wordObj.word}
                </Box>
              );
            })}
        </React.Fragment>
      );
    });
  };

  const TimeModeContainer = () => {
    return (
      <Box>
        {dateArrangement ? (
          arrayWithUrlsByDateType(dateArrangement, contextList).map(
            (sortByDateData) => {
              return (
                <Masonry
                  spacing={2}
                  columns={phraseMode ? 4 : 6}
                  key={sortByDateData.dateData}
                >
                  <Typography variant="h5">
                    {sortByDateData.dateData.slice(5)}
                  </Typography>
                  {sortByDateData.sortByUrlData.map((arrayWithUrl) => {
                    const domainInfo =
                      domainAndLinkList.find(
                        (domainAndLinkObj) =>
                          domainAndLinkObj.url ===
                          new URL(arrayWithUrl.url).hostname
                      ) || '';
                    return (
                      <WordCollectionPageBox
                        // targetWordRef={targetWordRef}
                        key={arrayWithUrl.url}
                        imgUri={domainInfo.icon}
                        arrayWithUrl={arrayWithUrl}
                        showingWord={showingWord}
                        handleWordClick={handleWordClick}
                      />
                    );
                  })}
                </Masonry>
              );
            }
          )
        ) : (
          <Masonry spacing={2} columns={phraseMode ? 4 : 6}>
            {pagesWords(contextList).map((arrayWithUrl) => {
              return (
                <WordCollectionPageBox
                  // targetWordRef={targetWordRef}
                  key={arrayWithUrl.url}
                  arrayWithUrl={arrayWithUrl}
                  showingWord={showingWord}
                  handleWordClick={handleWordClick}
                />
              );
            })}
          </Masonry>
        )}
      </Box>
    );
  };

  const OrderByTimeAndSiteContainer = () => {
    return (
      <Masonry spacing={2} columns={phraseMode ? 4 : 6}>
        {domainPageWords(contextList).map((arrayWithDomain) => {
          const domainInfo =
            domainAndLinkList.find(
              (domainAndLinkObj) => domainAndLinkObj.url === arrayWithDomain[0]
            ) || '';
            console.log(domainInfo.icon)
          return (
            <Box
              sx={{
                border: '1px solid black',
                padding: '5px',
                backgroundColor: 'background.light',
                borderRadius: '3px',
              }}
              key={arrayWithDomain[0]}
            >
              <img
                width="20px"
                height="20px"
                loading="lazy"
                src={domainInfo.icon}
                alt=""
              />
              {arrayWithDomain[1].map((arrayWithUrl, i) => {
                return (
                  <Box key={arrayWithUrl.url}>
                    {arrayWithUrl.words.map((wordObj) => {
                      return (
                        <Box key={wordObj.id} id={wordObj.id}>
                          {phraseMode ? (
                            <Box
                              component="span"
                              // ref={showingWord?.id === wordObj.id ? targetWordRef : null}
                              sx={{
                                color:
                                  showingWord?.id === wordObj.id
                                    ? 'primary.dark'
                                    : '',
                              }}
                              className="small-word-span"
                              onClick={() => handleWordClick(wordObj.id)}
                            >
                              {getAllPhrasesInThisContext(
                                wordObj,
                                arrayWithUrl.url
                              ) ? (
                                <Highlighter
                                  colorStyle={{ color: '#e06666' }}
                                  highlightWord={wordObj.word}
                                  text={
                                    getAllPhrasesInThisContext(
                                      wordObj,
                                      arrayWithUrl.url
                                    )[0]
                                  }
                                />
                              ) : (
                                wordObj.word
                              )}
                            </Box>
                          ) : (
                            <Box
                              component="span"
                              // ref={showingWord?.id === wordObj.id ? targetWordRef : null}
                              sx={{
                                color:
                                  showingWord?.id === wordObj.id
                                    ? 'primary.dark'
                                    : '',
                              }}
                              className="small-word-span"
                              onClick={() => handleWordClick(wordObj.id)}
                            >
                              {wordObj.word}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                    {i === arrayWithDomain[1].length - 1 ? null : <Divider />}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Masonry>
    );
  };

  const ShowingWordBlock = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            margin: '25px',
            width: '65vw',
            height: 'fit-content',
            backgroundColor: 'background.light',
            borderRadius: '10px',
            border: '1px solid grey',
            boxShadow: (theme) => `5px 5px ${theme.palette.primary.dark}`,
          }}
        >
          <Box id={`s-${showingWord.id}`}>
            <Typography variant="h5">
              {showingWord.phrase ? (
                <Highlighter
                  colorStyle={{ color: '#e06666' }}
                  highlightWord={showingWord.word}
                  text={showingWord.phrase}
                />
              ) : (
                showingWord.word
              )}
            </Typography>
            <Typography variant="h6"> {showingWord.alias}</Typography>
            <button onClick={() => handleSelectPhrase(showingWord.id)}>
              句
            </button>
          </Box>
          <Typography variant="body1"> {showingWord.context}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        // height: showingWord ? '65vh' : '80vh',
        height: '30vh',
        width: '60vw',
        padding: '10px',
        overflowY: alphabeticalOrderMode ? 'hidden' : 'scroll',
        overflowX: alphabeticalOrderMode ? 'scroll' : 'hidden',
        border: '1px solid black',
        //  backgroundColor:"#d1d0d0"
        columnCount: alphabeticalOrderMode ? 7 : '',
        // columnGap: alphabeticalOrderMode ? '40px' : ''
      }}
    >
      {alphabeticalOrderMode ? (
        <AlphabeticalOrderModeContainer />
      ) : timeMode ? (
        <TimeModeContainer />
      ) : (
        <OrderByTimeAndSiteContainer />
      )}
    </Box>
  );
};
