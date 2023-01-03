import { html } from 'lit';
import { submitTags } from '../form/submitTags';
import { openTagsInputButton } from './contextForLookUp';

export const definitionTags = (wordBlock, tags, definitionId) => {
  const { tagList } = wordBlock;
  const allTagLabels = tagList.map((tagObj) => tagObj.tag);
  const tagObjs = tags.map(
    (tagId) =>
      tagList.find((tagObj) => tagObj.id === tagId) || { id: tagId, tag: tagId }
  );
  const selectedTagLabels = tagObjs.map((tagObj) => tagObj.tag);

  const handleSubmitTags = (e) => {
    const { selectedOptions, newAddedOptions } = e.detail;
    submitTags(
      wordBlock,
      tagList,
      tagObjs,
      selectedOptions,
      newAddedOptions,
      definitionId
    );
  };

  const tagsBox = () => {
    return html` <div class="tags-button-container">
      <div id="tags-${definitionId}">
        ${selectedTagLabels.map((tagLabel) => {
          return html`<hooli-tag .tagLabel=${tagLabel}></hooli-tag>`;
        })}
        ${tags.length > 0 ? openTagsInputButton(wordBlock, definitionId) : null}
      </div>
    </div>`;
  };
  const tagsInput = () => {
    return html`<hooli-selectable-tags-input
      .options=${allTagLabels}
      .selectedOptions=${selectedTagLabels}
      @cancel-input=${wordBlock._toLookUpMode}
      @submit-tags=${handleSubmitTags}
      id="tags-input-${definitionId}"
    >
    </hooli-selectable-tags-input>`;
  };

  if (wordBlock._formInputStatus.editingTagDefId === definitionId)
    return html`${tagsInput()}`;
  return html`${tagsBox()}`;
};
