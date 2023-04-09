import { renderMultipleRuby } from './renderRuby';

let visible = true;
document.addEventListener('visibilitychange', () => {
  visible = document.visibilityState === 'visible';
});

let newAddedNodes = [];
let newRemovedNodes = [];
let runningIntervalId = null;

export const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    newAddedNodes.push(...mutation.addedNodes);
    newRemovedNodes.push(...mutation.removedNodes);
  });

  if (!visible || runningIntervalId) return;

  runningIntervalId = setInterval(() => {
    if (!visible || newAddedNodes.length === 0) {
      clearInterval(runningIntervalId);
      runningIntervalId = null;
      return;
    }

    const nodesToHandle = newAddedNodes.filter(
      (addedNode) =>
        newRemovedNodes.indexOf(addedNode) === -1 &&
        !addedNode.tagName?.includes('HOOLI')
    );

    if (nodesToHandle.length === 0) {
      clearInterval(runningIntervalId);
      runningIntervalId = null;
      newAddedNodes = [];
      newRemovedNodes = [];
      return;
    }

    renderMultipleRuby(nodesToHandle);

    newAddedNodes = [];
    newRemovedNodes = [];
  }, 3500);
});
