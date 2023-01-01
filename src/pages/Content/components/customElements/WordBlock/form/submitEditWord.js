import { store } from '../../../../redux/store';
import { updateOneWord } from '../../../../redux/wordDataSlice';
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
      definitions.push({
        definitionId,
        annotation,
        note,
        tags: [],
      });
    });

    // console.log(definitions, stem, variants, matchRule);

    const wordObjToUpdate = { word, definitions };
    if (stem) wordObjToUpdate.stem = stem;
    if (variants) wordObjToUpdate.variants = variants;
    if (matchRule) wordObjToUpdate.matchRule = matchRule;

    submitAndExecute(
      {
        action: 'editWord',
        wordId: wordBlock.wordObj.id,
        wordObjToUpdate,
        // word,
        // definitions,
        // stem,
        // variants,
        // matchRule,
      },
      () => {
        // store.dispatch(
        //   updateOneWord({ ...wordBlock.wordObj, ...wordObjToUpdate })
        // );
        wordBlock._toLookUpMode();
      }
    );
  }
};
