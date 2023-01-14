import { html } from 'lit';

const definitionInput = (wordBlock, definitionObj) => {
  let definitionId = 'new';
  let note = '';
  let annotation = '';
  if (definitionObj) {
    definitionId = definitionObj.definitionId;
    note = definitionObj.note;
    annotation = definitionObj.annotation;
  }

  setTimeout(() => {
    wordBlock.renderRoot.querySelector('.annotation-input')?.focus();
  });
  // }
  return html`
              <div id=${
                'definition-input-container-' + definitionId
              } class='definition-input-container'>
      <input 
      autocomplete="off"
      name='annotation'
      class='editable annotation-input' 
      autofocus
      placeholder='annotation'
      type="text" 
      id=${'annotation-input-' + definitionId}
      .value="${annotation}"
      @input="${wordBlock._handleValidInput}"
      @keypress="${wordBlock._handleEnterSubmit}"
      @change="${wordBlock._handleShortNote}">
      </input>

      <hooli-textarea 
      value=${note}
      class='editable long-note-textarea' 
      id=${'long-note-textarea-' + definitionId} 
      placeholder="note (optional)"
       @input="${wordBlock._handleValidInput}"
        @keypress="${wordBlock._handleEnterSubmit}">
        </hooli-textarea>
        </div>
      `;
};

const definitionSelectable = (definitionObj, isChecked) => {
  const { definitionId } = definitionObj;
  const annotation = definitionObj.annotation;

  const clickInsideRadio = (e) => {
    if (e.target.classList.contains('definition-selectable')) {
      const targetRadio = e.target.querySelector('input');
      targetRadio.click();
    }
  };
  return html`<div class='definition-selectable' @click="${clickInsideRadio}">
          <input type='radio'  class='definition-selectable-radio'
          id=${'definition-selectable-' + definitionId}
          value=${definitionId}
          ?checked=${isChecked}
          name='definition-select'>
          </input>
          <label for=${
            'definition-selectable-' + definitionId
          }>${annotation}</label>
      </div>`;
};

export const definitionInputAndSelector = (wordBlock) => {
  //---------definition:annotation and note--------------------

  if (wordBlock.mode === 'newWord') {
    return html`<div id="definition-selector">
      ${definitionInput(wordBlock)}
    </div> `;
  }
  if (wordBlock.mode === 'editWord') {
    return html`<div id="definition-selector">
      ${wordBlock.wordObj.definitions.map((definitionObj, index) => {
        return html`<div>
          <div class="definition-index">${index + 1}</div>
          ${definitionInput(wordBlock, definitionObj)}
        </div>`;
      })}
    </div>`;
  }
  if (wordBlock.mode === 'newContext') {
    if (!wordBlock._formInputStatus.newDefinitionWhenDefinitionSelecting) {
      setTimeout(
        () =>
          (wordBlock.renderRoot.querySelector(
            '.definition-selectable-radio'
          ).checked = true)
      );
    }

    const handleChangeToSelectMode = () => {
      wordBlock._handleUpdateFormStatus(
        'newDefinitionWhenDefinitionSelecting',
        false
      );
      setTimeout(() => {
        wordBlock.renderRoot
          .querySelectorAll('.definition-selectable-radio')
          .forEach((ele, index) => {
            if (index === 0) ele.checked = true;
            ele.disabled = false;
          });
      });
    };

    const handleChangeToAddMode = () => {
      wordBlock._handleUpdateFormStatus(
        'newDefinitionWhenDefinitionSelecting',
        true
      );
      setTimeout(() => {
        wordBlock.renderRoot
          .querySelectorAll('.definition-selectable-radio')
          .forEach((ele) => {
            ele.checked = false;
            ele.disabled = true;
          });
      });
    };

    return html`<div id="definition-selector">
      <div id="selection-or-add">
        ${wordBlock.wordObj.definitions.map((definitionObj) => {
          return html`${definitionSelectable(definitionObj)}`;
        })}
        ${wordBlock._formInputStatus.newDefinitionWhenDefinitionSelecting
          ? html`${definitionInput(wordBlock)}
              <button
                class="text-button"
                type="button"
                @click="${handleChangeToSelectMode}"
              >
                choose old one
              </button> `
          : html`<button
              class="text-button"
              type="button"
              @click="${handleChangeToAddMode}"
            >
              choose new definition
            </button>`}
      </div>
    </div>`;
  }
  if (wordBlock.mode === 'editContext') {
    const selectedDefRef = wordBlock.contexts.find(
      (contextObj) =>
        contextObj.id === wordBlock._formInputStatus.workingContext
    ).definitionRef;
    return html`<div id="definition-selector">
      <div id="selection-or-add">
        ${wordBlock.wordObj.definitions.map((definitionObj) => {
          return html`${definitionSelectable(
            definitionObj,
            selectedDefRef === definitionObj.definitionId
          )}`;
        })}
      </div>
    </div>`;
  }
};
