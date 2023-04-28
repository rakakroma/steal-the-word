export const restoreAndDeleteHooliText = (wordId) => {
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
};
