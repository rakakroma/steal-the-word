import { store } from '../../../../redux/store';
import { updateOneWord } from '../../../../redux/wordDataSlice';

export const submitAndExecute = (
  wordBlock,
  request,
  successFunc,
  backupFunc
) => {
  console.log(request);
  wordBlock._handleUpdateFormStatus('submitting', true);
  chrome.runtime.sendMessage(request, (response) => {
    console.log(response);
    if (!successFunc && !backupFunc) return;
    if (response.status === 'success') {
      successFunc(response);
    }
    if (typeof backupFunc === 'function') backupFunc(response);
  });
};
