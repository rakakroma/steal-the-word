import Dexie from 'dexie';
Dexie.debug = false;

export const db = new Dexie('hooliRuby');

db.version(1).stores({
  wordList: '&id, &word, stem, variants, *lang, *associationWordIds', //not using associationWordIds now
  /*   {
    id: 'AA_2mEeeIP2WAgq3kKtyx',
    word: 'stoppage',
    definitionCount: 1,
    definitions: [
      {
        annotation: 'A pause or halt of some activity.',
        definitionId: '0',
        note: '',
        tags: [tagId],
      },
    ],
    matchRule: '',
    stem: '',
    variants: [],
    stars:2,
  }, */
  domainAndLink: 'id++, &url, tags, *lang', //not using tags and lang  now
  /*   {
    url: 'en.wikipedia.org',
    activate: null,
    floatingWindow: null,
    mouseTool: null,
    icon:'',
    id: 1,
} */
  contextList: 'id++, word, date, pageTitle, url, wordId, definitionRef',
  /*   {
    context: '...to play stoppages...',
    wordId: 'AA_2mEeeIP2WAgq3kKtyx',
    date: 1676551817264,
    definitionRef: '0',
    pageTitle: 'American football - Wikipedia',
    phrase: '',
    url: 'https://en.wikipedia.org/wiki/American_football',
    id: 2,
  }, */
  tagList: '&id, &tag, wordDefRefs',
  /*      {
      id: 'AuM92Rzyc7EPokgjnmc4Q',
      tag: 'adv.',
      wordDefRefs: [
        {
          wordId: 'RAVSD5C7m_-qgs5GZqU6y',
          defId: '0',
        },
      ]
     }  */
});

db.open();
