import { db } from '../database';
import { successMessage } from '../messageTemplate';

const deleteHandlers = new Map();

const deleteThisWordObjAndAllItsContexts = 'deleteThisWordObjAndAllItsContexts';

deleteHandlers.set(
  deleteThisWordObjAndAllItsContexts,
  (
    { wordId, contextIdsToDelete, tagShouldBeDelete, tagShouldUpdateItsRefs },
    senderTab,
    sendResponse
  ) => {
    Promise.all([
      db.wordList.delete(wordId),
      db.contextList.bulkDelete(contextIdsToDelete),
      db.tagList.bulkDelete(tagShouldBeDelete),
      ...tagShouldUpdateItsRefs.map(async (tagData) => {
        const { wordDefRefs } = tagData;
        await db.tagList.update(tagData.id, { wordDefRefs });
      }),
    ])
      .then(
        sendResponse(
          successMessage(
            `delete ${wordId}, contexts ${contextIdsToDelete.join(', ')}`
          )
        )
      )
      .catch((err) => {
        console.error(err);
      });
  }
);

const deleteContexts = 'deleteContexts';

deleteHandlers.set(
  deleteContexts,
  ({ contextIdsToDelete }, senderTab, sendResponse) => {
    db.contextList
      .bulkDelete(contextIdsToDelete)
      .then(
        sendResponse(
          successMessage(`delete contexts ${contextIdsToDelete.join(', ')}`)
        )
      )
      .catch((err) => {
        console.error(err);
      });
  }
);

const deleteContextsAndDefinitions = 'deleteContextsAndDefinitions';

deleteHandlers.set(
  deleteContextsAndDefinitions,
  (
    {
      newDefinitions,
      wordId,
      contextIdsToDelete,
      tagShouldBeDelete,
      tagShouldUpdateItsRefs,
    },
    senderTab,
    sendResponse
  ) => {
    if (newDefinitions.length === 0) return; //error
    if (contextIdsToDelete.length === 0) return; //error

    Promise.all([
      db.contextList.bulkDelete(contextIdsToDelete),
      db.wordList.update({ id: wordId }, { definitions: newDefinitions }),
      db.tagList.bulkDelete(tagShouldBeDelete),
      ...tagShouldUpdateItsRefs.map(async (tagData) => {
        const { wordDefRefs } = tagData;
        await db.tagList.update(tagData.id, { wordDefRefs });
      }),
    ])
      .then(
        sendResponse(
          successMessage(
            `delete contexts ${contextIdsToDelete.join(', ')} and definition`
          )
        )
      )
      .catch((err) => {
        console.error(err);
      });
  }
);

export {
  deleteThisWordObjAndAllItsContexts,
  deleteContexts,
  deleteContextsAndDefinitions,
  deleteHandlers,
};
