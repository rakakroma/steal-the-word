import { myLog } from '../../../../utils/customLogger';

export const submitAndExecute = (
  wordBlock,
  request,
  successFunc,
  backupFunc
) => {
  myLog(request);
  wordBlock._handleUpdateFormStatus('submitting', true);
  chrome.runtime.sendMessage(request, (response) => {
    myLog(response);
    if (!successFunc && !backupFunc) return;
    if (response.status === 'success') {
      myLog(response);
      successFunc(response);
    }
    if (typeof backupFunc === 'function') backupFunc(response);
  });
};
