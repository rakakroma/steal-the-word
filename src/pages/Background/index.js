import { defaultLangOptions } from '../../utilsForAll/languageAndApiData';
import { getTextStyleData } from '../../utilsForAll/textStyleData';
import './databaseSubscription';
import { deleteHandlers } from './handler/deleteData';
import { fetchHandlers } from './handler/fetchData';
import { getHandlers } from './handler/getData';
import { updateBadgeHandlers } from './handler/updateBadge';
import { updateHandlers } from './handler/updateData';

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

  if (Object.keys(currentData).length !== Object.keys(initialData).length) {
    let dataToSet = null;
    if (Object.keys(currentData).length === 0) {
      dataToSet = initialData;
    } else {
      Object.entries(initialData).forEach(([key, initialValue]) => {
        if (!currentData.hasOwnProperty(key)) {
          dataToSet[key] = initialValue;
        }
      });
    }

    chrome.storage.local.set(dataToSet);
  }

  // chrome.runtime.openOptionsPage();
  // stop open options automatically because it would be opened whenever this extension got version updated,
  //which is annoying..
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'save word' });
});

/* 
i am not sure if using Map is better than using Object, 
just wanna to try it
 */
const messageHandlers = new Map([
  ...updateBadgeHandlers,
  ...updateHandlers,
  ...getHandlers,
  ...deleteHandlers,
  ...fetchHandlers,
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
