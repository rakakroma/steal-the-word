import { LabelsIcon } from '@spectrum-web-components/icons-workflow';
import { html } from 'lit';
import { store } from '../../../../redux/store';
import { getTagList } from '../../../../redux/wordDataSlice';
import { openTagsInputButton } from './contextForLookUp';

export const definitionTags = (wordBlock, tags, definitionId) => {
  const tagList = getTagList(store.getState());

  // const handleExitInputMode = (e) => {
  //   // wordBlock._handleUpdateFormStatus('editingTagDefId', null);
  //   wordBlock._toLookUpMode();
  // };
  const handleSubmitTags = (e) => {
    console.log(e.detail);
    wordBlock._toLookUpMode();
  };
  const allTagLabels = tagList.map((tagObj) => tagObj.tag);
  const selectedTagLabels = tags.map(
    (tagId) => tagList.find((tagObj) => tagObj.id === tagId).tag
  );

  const tagsBox = () => {
    return html` <div class="tags-button-container">
      <div id="tags-${definitionId}">
        ${selectedTagLabels.map((tagLabel) => {
          return html`<hooli-tag taglabel=${tagLabel}></hooli-tag>`;
        })}
        ${tags.length > 0 ? openTagsInputButton(wordBlock, definitionId) : null}
      </div>
    </div>`;
  };
  const tagsInput = () => {
    return html`<hooli-selectable-tags-input
      .options=${allTagLabels}
      .selectedoptions=${selectedTagLabels}
      @cancel-input=${wordBlock._toLookUpMode}
      @submit-tags=${handleSubmitTags}
      @cancelediting=${(e) => console.log(e)}
      id="tags-input-${definitionId}"
    >
    </hooli-selectable-tags-input>`;
  };

  if (wordBlock._formInputStatus.editingTagDefId === definitionId)
    return html`${tagsInput()}`;
  return html`${tagsBox()}`;
};
