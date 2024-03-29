import { updatePosition } from './setPosition';
import '../components/customElements/HooliAddingTool';

const mouseUpListener = (e) => {
  const addingToolOnBody = document.querySelector('hooli-adding-tool');
  if (addingToolOnBody) {
    if (e.composedPath().find((e) => e.tagName === 'HOOLI-ADDING-TOOL')) {
      return;
    }
    addingToolOnBody.remove();
  }
  if (e.button === 2) return; //ignore right click
  setTimeout(() => {
    const selection = document.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText || selectedText.length > 60) return;
    if (selection.anchorNode?.children) return; //ignore web component e.g. input, textarea, and my lit element
    const addingTool = document.createElement('hooli-adding-tool');
    updatePosition(window.getSelection().getRangeAt(0), addingTool);
    document.body.appendChild(addingTool);
  }, 5);
};

export const setMouseUpToolTip = () => {
  document.body.addEventListener('mouseup', mouseUpListener);
};

export const stopMouseUpToolTip = () => {
  body.removeEventListener('mouseup', mouseUpListener);
};
