const updateBadgeHandlers = new Map();

const setStopBadge = (tabId) => {
  chrome.action.setBadgeText({ text: 'STOP', tabId });
};

const updateBadgeToNoWork = 'updateBadgeToNoWork'; //notWorking

updateBadgeHandlers.set(
  updateBadgeToNoWork,
  (request, senderTab, sendMessage) => {
    setStopBadge(senderTab.id);
  }
);

const updateWordCount = 'updateWordCount';

updateBadgeHandlers.set(
  updateWordCount,
  ({ count }, senderTab, sendMessage) => {
    chrome.action.setBadgeText({
      text: `${count}`,
      tabId: senderTab.id,
    });
  }
);

export {
  updateBadgeHandlers,
  setStopBadge,
  updateBadgeToNoWork,
  updateWordCount,
};
