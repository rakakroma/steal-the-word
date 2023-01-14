import { updateBadgeHandlers } from './updateBadge';
import { updateHandlers } from './updateData';
import { getHandlers } from './getData';
import { deleteHandlers } from './deleteData';
import './databaseSubscription';
import { myLog } from '../Content/utils/customLogger';

chrome.action.setBadgeBackgroundColor({ color: '#4f4f4f' });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Save "%s" to HolliRuby',
    contexts: ['selection'],
    id: 'holli77777',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'save word' });
});

const messageHandlers = new Map([
  ...updateBadgeHandlers,
  ...updateHandlers,
  ...getHandlers,
  ...deleteHandlers,
]);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handler = messageHandlers.get(request.action);
  if (handler) {
    handler(request, sender.tab, sendResponse);
  } else {
    myLog(request);
  }

  return true;
});
