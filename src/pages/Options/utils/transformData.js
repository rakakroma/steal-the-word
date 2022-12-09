import dayjs from 'dayjs';

export const pagesWords = (contexts) => {
  const allPages = [...new Set(contexts.map((contextObj) => contextObj.url))];
  return allPages.map((pageLink) => {
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
//not sure if its necessary
// export const newPageWords = pagesWords.sort((a, b) => getLatestDateInContextInfos(b.words[0], b.url) - getLatestDateInContextInfos(a.words[0], a.url))

// console.log(newPageWords)

// const customMatchUrls = ['developer.mozilla.org/ja'];

// const allDomains = [...new Set(pagesWords.map(page => getDomain(page.url)))]

export const domainPageWords = (words) =>
  pagesWords(words).reduce((acc, curr) => {
    // const matchedCustomUrl = customMatchUrls.find((matchPart) =>
    //   curr.url.includes(matchPart)
    // );
    // if (matchedCustomUrl) {
    //   if (
    //     acc.find(
    //       (pagesAndMatchRule) => pagesAndMatchRule[0] === matchedCustomUrl
    //     )
    //   ) {
    //     return acc.map((pagesAndMatchRule) => {
    //       if (pagesAndMatchRule[0] === matchedCustomUrl)
    //         pagesAndMatchRule[1].push(curr);
    //       return pagesAndMatchRule;
    //     });
    //   } else {
    //     acc.push([matchedCustomUrl, [curr]]);
    //     return acc;
    //   }
    // } else {

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
