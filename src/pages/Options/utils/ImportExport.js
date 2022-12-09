import { db } from '../../Background/database';

export const exportToJsonFile = (obj) => {
  const dataStr = JSON.stringify(obj);
  const dataUri =
    'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  return dataUri;
};

export const saveImportDataToDB = (importedData) => {
  const { wordList, contextList, domainAndLinkList } = importedData;

  const excludeIdInfo = (list) => {
    return list.map((listObj) => {
      delete listObj.id;
      return listObj;
    });
  };
  const contextListWithoutId = excludeIdInfo(contextList);
  const domainAndLinkListWithoutId = excludeIdInfo(domainAndLinkList);

  db.wordList.bulkAdd(wordList);
  db.contextList.bulkAdd(contextListWithoutId);
  db.domainAndLink.bulkAdd(domainAndLinkListWithoutId);
};

export const clearDB = () => db.delete().then(() => db.open());
