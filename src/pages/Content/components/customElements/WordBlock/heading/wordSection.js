import { html } from 'lit';

export const wordSection = (wordBlock) => {
  const displayingWord = html` <h3>${wordBlock.wordObj?.word}</h3>`;
  const deletingWord = html`<input type='checkbox'
       class='checkbox'
        name='delete-all' 
       id='heading-word-delete-checkbox' 
       @change="${wordBlock._handleCheckboxSelect}"></input>
       <label for='heading-word-delete-checkbox'>
       ${displayingWord}
       </label>`;

  if (wordBlock.mode === 'deleting') return deletingWord;
  const inputWord = html`<input 
                  autocomplete="off"
                  name='word'
                  type='text'
                  id='word-input' class='editable' 
                  @input="${wordBlock._handleValidInput}"
                   @keypress="${wordBlock._handleEnterSubmit}"
                   .value="${wordBlock.wordObj?.word || wordBlock.newWord}"
                   ></input>`;

  if (['newWord', 'editWord'].includes(wordBlock.mode)) return inputWord;
  return displayingWord;
};
