import Dexie from 'dexie';
Dexie.debug = false;

export const db = new Dexie('hooliRuby');
db.version(1).stores({
  wordList: '&id, &word, stem, variants, *lang, *associationWordIds',
  domainAndLink: 'id++, &url, tags, *lang',
  contextList: 'id++, word, date, pageTitle, url, wordId, definitionRef', //phrase, note
  tagList: '&id, &tag, wordDefRefs',
});

db.open();
