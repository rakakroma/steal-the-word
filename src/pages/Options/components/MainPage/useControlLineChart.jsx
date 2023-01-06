import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ContextListContext } from '../../Options';
import dayjs from 'dayjs';

export const useControlLineChart = () => {
  const defaultDateOption = {
    month: {
      datePrecision: 'month',
      startUnixDate: null,
      endUnixDate: null,
    },
    day: {
      datePrecision: 'day',
      startUnixDate: null,
      endUnixDate: null,
    },
  };

  const configValue = {
    month: {
      dayJSFormat: 'YYYY-MM',
      xFormat: '%Y-%m',
      axisBottomFormat: '%b',
      tickValues: 'every 1 month',
      curve: 'cardinal',
    },
    day: {
      dayJSFormat: 'YYYY-MM-DD',
      xFormat: '%Y-%m-%d',
      axisBottomFormat: '%b %d',
      tickValues: 'every 5 days',
      curve: 'stepAfter',
    },
  };
  const [dateOption, setDateOption] = useState(defaultDateOption['month']);
  const [latestUnixDate, setLatestUnixDate] = useState(null);
  const contextList = useContext(ContextListContext);

  const getStartDateFromEnd = useCallback((latestDate, timeUnit) => {
    return dayjs(latestDate).subtract(1, timeUnit).valueOf();
  }, []);

  const getOptionTemplate = useCallback(
    (latestDate, datePrecision) => {
      const subtractUnit = {
        month: 'year',
        day: 'month',
      };
      return {
        datePrecision,
        startUnixDate: getStartDateFromEnd(
          latestDate,
          subtractUnit[datePrecision]
        ),
        endUnixDate: latestDate,
      };
    },
    [getStartDateFromEnd]
  );

  const sortedContextList = useMemo(() => {
    if (!contextList) return null;
    return [...contextList]
      .map((contextObj) => ({
        wordId: contextObj.wordId,
        date: contextObj.date,
      }))
      .sort((a, b) => a.date - b.date);
  }, [contextList]);

  useEffect(() => {
    if (!sortedContextList) return;
    const latestDate = sortedContextList[sortedContextList.length - 1].date;
    setLatestUnixDate(latestDate);
    setDateOption(getOptionTemplate(latestDate, 'month'));
  }, [sortedContextList, getOptionTemplate]);

  if (!contextList) {
    return {
      noContextData: true,
    };
  }

  const filteredList = sortedContextList.filter(
    (data) =>
      data.date >= dateOption.startUnixDate &&
      data.date <= dateOption.endUnixDate
  );

  const countData = filteredList.reduce(
    (accu, curr) => {
      const dateData = dayjs(curr.date)
        .startOf(dateOption.datePrecision)
        .format(configValue[dateOption.datePrecision].dayJSFormat);

      const contextCountIndexOfThisDate = accu.contextData.data.findIndex(
        (dateObj) => dateObj.x === dateData
      );
      if (contextCountIndexOfThisDate === -1) {
        accu.contextData.data.push({
          x: dateData,
          y:
            1 +
            (accu.contextData.data[accu.contextData.data.length - 1]?.y || 0),
        });
      } else {
        accu.contextData.data[contextCountIndexOfThisDate].y += 1;
      }

      //NOTE: This word count can work but the labels would overlap,
      //choose to disable the point label or to disable word count line

      // const wordCountIndexOfThisDate = accu.wordData.data.findIndex(
      //   (dateObj) => dateObj.x === dateData
      // );
      // if (accu.countedWordIds.indexOf(curr.wordId) === -1) {
      //   accu.countedWordIds.push(curr.wordId);
      //   if (wordCountIndexOfThisDate === -1) {
      //     accu.wordData.data.push({
      //       x: dateData,
      //       y: 1 + (accu.wordData.data[accu.wordData.data.length - 1]?.y || 0),
      //     });
      //   } else {
      //     accu.wordData.data[wordCountIndexOfThisDate].y += 1;
      //   }
      // }

      return accu;
    },
    {
      // countedWordIds: [],
      // wordData: {
      //   id: 'word',
      //   data: [],
      // },
      contextData: {
        id: 'context',
        data: [],
      },
    }
  );

  const datePrecisionToDayJsUnit = {
    day: 'month',
    month: 'year',
  };

  const handleToNextAdjacentPeriod = (datePrecision) => {
    const unit = datePrecisionToDayJsUnit[datePrecision];
    const nextStartUnix = dayjs(dateOption.startUnixDate)
      .add(1, unit)
      .startOf(unit)
      .valueOf();
    if (
      sortedContextList.findIndex((data) => data.date >= nextStartUnix) > -1
    ) {
      setDateOption({
        datePrecision,
        startUnixDate: nextStartUnix,
        endUnixDate: dayjs(nextStartUnix).endOf(unit).valueOf(),
      });
    } else {
      const targetStartDayjs = dayjs(sortedContextList[0].date).startOf(unit);
      setDateOption({
        datePrecision,
        startUnixDate: targetStartDayjs.valueOf(),
        endUnixDate: targetStartDayjs.endOf(unit).valueOf(),
      });
    }
  };
  const handleToPreviousAdjacentPeriod = (datePrecision) => {
    const unit = datePrecisionToDayJsUnit[datePrecision];

    const previousEndUnix = dayjs(dateOption.startUnixDate)
      .subtract(1, unit)
      .endOf(unit)
      .valueOf();
    if (
      sortedContextList.findIndex((data) => data.date <= previousEndUnix) > -1
    ) {
      setDateOption({
        datePrecision,
        startUnixDate: dayjs(previousEndUnix).startOf(unit).valueOf(),
        endUnixDate: previousEndUnix,
      });
    } else {
      const targetStartDayjs = dayjs(
        sortedContextList[sortedContextList.length - 1].date
      ).startOf(unit);
      setDateOption({
        datePrecision,
        startUnixDate: targetStartDayjs.valueOf(),
        endUnixDate: targetStartDayjs.endOf(unit).valueOf(),
      });
    }
  };

  const periodTitle = `${dayjs(dateOption.startUnixDate).format(
    'YYYY/MM/DD'
  )} -  ${dayjs(dateOption.endUnixDate).format('YYYY/MM/DD')}`;
  return {
    dateOption,
    setDateOption,
    setLatestDate: (precision) => {
      setDateOption(getOptionTemplate(latestUnixDate, precision));
    },
    setCertainMonth: (dateTarget) => {
      setDateOption({
        datePrecision: 'day',
        startUnixDate: dayjs(dateTarget).startOf('month').valueOf(),
        endUnixDate: dayjs(dateTarget).endOf('month').valueOf(),
      });
    },
    defaultDateOption,
    currentConfig: configValue[dateOption.datePrecision],
    chartData: [countData.contextData],
    noContextData: false,
    isMoreThanTwelveMonth:
      getStartDateFromEnd(latestUnixDate, 'year') > sortedContextList[0].date,
    isMoreThanOneMonth:
      getStartDateFromEnd(latestUnixDate, 'month') > sortedContextList[0].date,
    handleToNextAdjacentPeriod,
    handleToPreviousAdjacentPeriod,
    periodTitle,
  };
};
