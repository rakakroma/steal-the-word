import { fetchPronInfoFromApi } from '../fetchPronInfoFromApi';

const fetchHandlers = new Map();

const fetchPronInfo = 'fetchPronInfo';

fetchHandlers.set(fetchPronInfo, async (request, senderTab, sendResponse) => {
  const { targetWord, contextHere, langOptions, lang } = request;

  try {
    const pronInfoResult = await fetchPronInfoFromApi(
      targetWord,
      contextHere,
      langOptions,
      lang
    );
    sendResponse(pronInfoResult);
  } catch (err) {
    console.error(err);
  }
});

export { fetchHandlers, fetchPronInfo };
