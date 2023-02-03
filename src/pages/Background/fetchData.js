import { fetchPronInfoFromApi } from './fetchPronInfoFromApi';

const fetchHandlers = new Map();

const fetchPronInfo = 'fetchPronInfo';

fetchHandlers.set(fetchPronInfo, (request, senderTab, sendResponse) => {
  const { targetWord, contextHere, langOptions, lang } = request;
  (async () => {
    const pronInfoResult = await fetchPronInfoFromApi(
      targetWord,
      contextHere,
      langOptions,
      lang
    );
    sendResponse(pronInfoResult);
  })();
});

export { fetchHandlers, fetchPronInfo };
