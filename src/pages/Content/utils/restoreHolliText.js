import { myList } from '../index';

export const restoreHolliText = (wordId) => {
  let targetEles;
  if (!wordId) {
    targetEles = document.querySelectorAll('holli-text');
  } else {
    targetEles = document.querySelectorAll(`.h-${wordId}`);
  }
  targetEles.forEach((ele) => {
    const fragment = new DocumentFragment();
    fragment.textContent = ele.textContent;
    ele.replaceWith(fragment);
  });
  const targetWordIndex = myList.findIndex((wordObj) => wordObj.id === wordId);
  myList.splice(targetWordIndex, 1);
};
