import { submitAndExecute } from './submitAndExecute';

export const submitEditWord = (wordBlock, word, stem, variants, matchRule) => {
  if (wordBlock.mode === 'editWord') {
    if (!wordBlock._formValidation(['word'], { word })) return;
    const defintionEles = wordBlock.renderRoot.querySelectorAll(
      '.definition-input-container'
    );

    const definitions = [];
    defintionEles.forEach((ele) => {
      const splittedEleId = ele.id.split('-');
      const definitionId = splittedEleId[splittedEleId.length - 1];
      const annotation = ele.querySelector('.annotation-input').value.trim();
      const note = ele.querySelector('.long-note-textarea').value.trim();
      const tags = wordBlock.wordObj.definitions.find(
        (definitionObj) => definitionObj.definitionId === definitionId
      )?.tags;
      definitions.push({
        definitionId,
        annotation,
        note,
        tags,
      });
    });

    const wordObjToUpdate = { word, definitions };
    if (stem) wordObjToUpdate.stem = stem;
    if (variants) wordObjToUpdate.variants = variants;
    if (matchRule) wordObjToUpdate.matchRule = matchRule;

    submitAndExecute(
      wordBlock,
      {
        action: 'editWord',
        wordId: wordBlock.wordObj.id,
        wordObjToUpdate,
      },
      () => {
        wordBlock._toLookUpMode();
      }
    );
  }
};
