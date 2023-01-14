import { updateBadgeHandlers } from './updateBadge';
import { updateHandlers } from './updateData';
import { getHandlers } from './getData';
import { deleteHandlers } from './deleteData';
import './databaseSubscription';
import { getTextStyleData } from '../../utilsForAll/textStyleData';
import { defaultLangOptions } from '../../utilsForAll/languageAndApiData';

chrome.action.setBadgeBackgroundColor({ color: '#4f4f4f' });

const initialData = {
  activate: true,
  mouseTool: true,
  floatingWindow: true,
  textStyle: getTextStyleData('default'),
  apiSetting: defaultLangOptions,
};

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    title: 'Save "%s" to Steal The Word',
    contexts: ['selection'],
    id: 'holli77777',
  });
  const currentData = await chrome.storage.local.get(Object.keys(initialData));

  const dataToSet = Object.entries(initialData).reduce(
    (accu, [key, initialValue]) => {
      if (currentData[key]) accu[key] = currentData[key];
      return accu;
    },
    initialData
  );

  chrome.storage.local.set(dataToSet);
  chrome.runtime.openOptionsPage();
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
    console.log(request);
  }

  return true;
});
