import dayjs from 'dayjs';

const getAllPages = (contexts) => [
  ...new Set(contexts.map((contextObj) => contextObj.url)),
];

export const pagesWords = (contexts) => {
  return getAllPages(contexts).map((pageLink) => {
    const page = { url: pageLink };
    const wordsInPage = contexts.reduce((acc, currentValue) => {
      if (currentValue.url === pageLink) return acc.concat(currentValue);
      return acc;
    }, []);

    page.words = wordsInPage.sort((a, b) => {
      return b.date - a.date;
    });
    return page;
  });
};

export const domainPageWords = (words) =>
  pagesWords(words).reduce((acc, curr) => {
    const hostName = new URL(curr.url).hostname || curr.url;
    if (acc.find((pagesAndMatchRule) => pagesAndMatchRule[0] === hostName)) {
      return acc.map((pagesAndMatchRule) => {
        if (pagesAndMatchRule[0] === hostName) pagesAndMatchRule[1].push(curr);
        return pagesAndMatchRule;
      });
    } else {
      acc.push([hostName, [curr]]);
      return acc;
    }
    // }
  }, []);

export const arrayWithUrlsByDateType = (dateType, words) => {
  return pagesWords(words).reduce((acc, currentValue) => {
    const dateData = dayjs(currentValue.words[0].date)
      .startOf(dateType)
      .format('YYYY/MM/DD');
    const dateDataYearForObjectKey = `y${dateData.slice(0, 4)}`;
    const matchCurrentAccYear = acc.hasOwnProperty(dateDataYearForObjectKey);
    const initialDataForCurrentDate = {
      dateData,
      sortByUrlData: [currentValue],
    };
    if (!matchCurrentAccYear) {
      Object.assign(acc, {
        [dateDataYearForObjectKey]: [initialDataForCurrentDate],
      });
      return acc;
    }
    const targetAccYearValue = acc[dateDataYearForObjectKey];
    const sameDateDataIndex = targetAccYearValue.findIndex(
      (sortByDateData) => sortByDateData.dateData === dateData
    );
    if (sameDateDataIndex === -1) {
      targetAccYearValue.push(initialDataForCurrentDate);
      return acc;
    } else {
      targetAccYearValue[sameDateDataIndex].sortByUrlData.push(currentValue);
      return acc;
    }
  }, {});
};

export const wordListInAlphabeticalOrder = (wordList) => {
  return [...wordList].sort((a, b) => {
    return a.word.localeCompare(b.word);
  });
};

export const cutUrl = (url) => {
  let result = url;
  if (!url) return '';
  if (url.startsWith('www.')) {
    result = result.replace('www.', '');
  }
  if (url.endsWith('.com')) {
    result = result.slice(0, -4);
  }
  return result;
};
