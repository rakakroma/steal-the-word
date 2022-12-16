import Dexie from 'dexie';
Dexie.debug = false;

export const db = new Dexie('hooliRuby');
db.version(1).stores({
  // wordList: "id, word, alias, date, pageTitle, url",
  wordList: '&id, &word, stem, variants, *lang, *associationWordIds', //definitions, definitionCount, matchRule:'independent', 'noPrefix', 'noSuffix','jpVerb'
  //[[definitionId:, annotation, note:, tags:[]]]
  domainAndLink: 'id++, &url, tags, *lang', //dynamicRendering, floatingWindow, activate
  contextList: 'id++, word, date, pageTitle, url, wordId, definitionRef', //phrase, note
  tagList: '&id, &tag, wordDefRefs',
});

//lang用途：整理分類時使用，並可以限縮標注的網站，像是在中文網站不要標注日文的詞　**例外少
//tags用途：整理分類時使用，可以限制只在特定網站（如討論程式語言的網站）中出現該詞彙 **例外多
//必要性：如果需要一組以上的詞義，並且正確顯示的話，除了使用自然語言處理的方式外，還是要靠這種。但如果例外太多的話呢？
// db.on("populate", async (db) => {
//     // let myList;
//     // await chrome.storage.local.get(["myWordList"], async (obj) => {
//     //     if (obj.myWordList && obj.myWordList.length > 0) {
//     //         myList = await obj.myWordList
//     //     }
//     // })
//     // myList.map(wordObj => {
//     //     delete wordObj.id
//     //     return wordObj
//     // })

//     // db.transaction('rw', db.wordList, () => {
//     //     db.wordList.clear()
//     //     db.wordList.bulkAdd(myList)
//     //     db.wordList.add({ word: 'haha', alias: 'ss', date: Date.now().toString, pageTitle: 'aa', url: 'http:ss.com/ss' })
//     // })
//     const sample = { word: 'haha', alias: 'ss', date: Date.now().toString, pageTitle: 'aa', url: 'http:ss.com/ss' }
//     db.wordList.add(sample)
//     console.log('done');
// });

db.open();

// function recreateDB(db) {
//   return db.delete().then(() => db.open());
// }
// recreateDB(db);
