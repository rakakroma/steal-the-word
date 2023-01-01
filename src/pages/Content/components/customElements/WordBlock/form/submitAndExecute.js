import { store } from '../../../../redux/store';
import { updateOneWord } from '../../../../redux/wordDataSlice';

export const submitAndExecute = (request, successFunc, backupFunc) => {
  console.log(request);
  chrome.runtime.sendMessage(request, (response) => {
    console.log(response);
    if (!successFunc && !backupFunc) return;
    if (response.status === 'success') {
      successFunc(response);
    }
    if (typeof backupFunc === 'function') backupFunc(response);
  });
};

// export const updateWordObjToElementsAndWordList = (updatedWordObj) => {
//   store.dispatch(updateOneWord(updatedWordObj));
//   document.querySelectorAll(`h-${updatedWordObj.id}`).forEach((ele) => {
//     ele.wordObj = { ...updatedWordObj };
//   });
// };
