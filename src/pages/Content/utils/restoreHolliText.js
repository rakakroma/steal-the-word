import { store } from '../redux/store';
import { deleteOneWord } from '../redux/wordDataSlice';

export const restoreAndDeleteHooliText = (wordId) => {
  let targetEles;
  if (!wordId) {
    targetEles = document.querySelectorAll('holli-text');
  } else {
    // store.dispatch(deleteOneWord(wordId));
    targetEles = document.querySelectorAll(`.h-${wordId}`);
  }
  targetEles.forEach((ele) => {
    const fragment = new DocumentFragment();
    fragment.textContent = ele.textContent;
    ele.replaceWith(fragment);
  });
};
