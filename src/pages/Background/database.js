import Dexie from 'dexie';
Dexie.debug = false;

export const db = new Dexie('hooliRuby');
db.version(1).stores({
  // wordList: "id, word, alias, date, pageTitle, url",
  wordList: '&id, &word, stem, variants, *lang, *associationWordIds', //definitions, definitionCount, matchRule:'independent', 'noPrefix', 'noSuffix','jpVerb'
  //[[definitionId:, annotation, note:, tags:[]]]
  domainAndLink: 'id++, &url, tags, *lang', // floatingWindow, activate
  contextList: 'id++, word, date, pageTitle, url, wordId, definitionRef', //phrase, note
  tagList: '&id, &tag, wordDefRefs',
});

db.open();
