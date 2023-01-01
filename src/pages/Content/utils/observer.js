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
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((addedNode) => {
        newAddedNodes.push(addedNode);
      });
    }

    if (mutation.removedNodes.length > 0) {
      mutation.removedNodes.forEach((removedNode) => {
        newRemovedNodes.push(removedNode);
      });
    }
  });

  if (visible) {
    if (runningIntervalId) return;
    const checkIfNewNodes = setInterval(() => {
      if (!visible || newAddedNodes.length === 0) {
        clearInterval(checkIfNewNodes);
        runningIntervalId = null;
        return;
      }
      const nodesToHandle = newAddedNodes.filter((addedNode) => {
        if (newRemovedNodes.indexOf(addedNode) > -1) {
          return false;
        }
        if (addedNode.tagName?.includes('HOOLI')) return false;
        return true;
      });
      if (nodesToHandle.length === 0) {
        clearInterval(checkIfNewNodes);
        runningIntervalId = null;
        newAddedNodes = [];
        newRemovedNodes = [];
        return;
      }
      renderMultipleRuby(nodesToHandle);

      newAddedNodes = [];
      newRemovedNodes = [];
    }, 3000);
    runningIntervalId = checkIfNewNodes;
  }
});
