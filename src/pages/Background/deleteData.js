import { db } from './database';
import { successMessage } from './messageTemplate';

const deleteHandlers = new Map();

const deleteThisWordObjAndAllItsContexts = 'deleteThisWordObjAndAllItsContexts';

deleteHandlers.set(
  deleteThisWordObjAndAllItsContexts,
  (
    { wordId, contextIdsToDelete, tagShouldBeDelete, tagShouldUpdateItsRefs },
    senderTab,
    sendResponse
  ) => {
    (async () => {
      await db.wordList.delete(wordId);
      await db.contextList.bulkDelete(contextIdsToDelete);
      await db.tagList.bulkDelete(tagShouldBeDelete);
      await Promise.all(
        tagShouldUpdateItsRefs.map(async (tagData) => {
          const { wordDefRefs } = tagData;
          await db.tagList.update(tagData.id, { wordDefRefs });
        })
      );

      sendResponse(
        successMessage(
          `delete ${wordId}, contexts ${contextIdsToDelete.join(', ')}`
        )
      );
    })();
  }
);

const deleteContexts = 'deleteContexts';

deleteHandlers.set(
  deleteContexts,
  ({ contextIdsToDelete }, senderTab, sendResponse) => {
    (async () => {
      await db.contextList.bulkDelete(contextIdsToDelete);
      sendResponse(
        successMessage(`delete contexts ${contextIdsToDelete.join(', ')}`)
      );
    })();
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
    (async () => {
      await db.contextList.bulkDelete(contextIdsToDelete);
      await db.wordList.update({ id: wordId }, { definitions: newDefinitions });
      await db.tagList.bulkDelete(tagShouldBeDelete);
      await Promise.all(
        tagShouldUpdateItsRefs.map(async (tagData) => {
          const { wordDefRefs } = tagData;
          await db.tagList.update(tagData.id, { wordDefRefs });
        })
      );
      sendResponse(
        successMessage(
          `delete contexts ${contextIdsToDelete.join(', ')} and definition`
        )
      );
    })();
  }
);

export {
  deleteThisWordObjAndAllItsContexts,
  deleteContexts,
  deleteContextsAndDefinitions,
  deleteHandlers,
};
