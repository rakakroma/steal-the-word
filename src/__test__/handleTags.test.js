import { getTagFullDataArray, updateDefRef } from '../utilsForAll/handleTags';

/* 
 just some samples for implement unit testing
 */

const testTagList = [
  {
    id: 'tagId0',
    tag: 'abc',
    wordDefRefs: [{ wordId: 'hrNxowdU9_VRWZsvPYtNE', defId: '0' }],
  },
  {
    id: 'tagId1',
    tag: 'def',
    wordDefRefs: [
      {
        wordId: 'JhTq2KoP7fcrbYpGZaLRD',
        defId: '1',
      },
      {
        wordId: 'HtKs4YgB6tynmPzEJxXfV',
        defId: '2',
      },
    ],
  },
  {
    id: 'tagId2',
    tag: 'ghi',
    wordDefRefs: [
      {
        wordId: 'LmSv1TnX2pkfzjKoWbHYr',
        defId: '3',
      },
      {
        wordId: 'NpQr5uU9zJmZv6xWbYaHt',
        defId: '4',
      },
      {
        wordId: 'AsDf8GhJkLpZxYcVbNmQ',
        defId: '5',
      },
    ],
  },
  {
    id: 'tagId3',
    tag: 'jkl',
    wordDefRefs: [
      {
        wordId: 'TbPn7sLkYrVmZdEaHjGf',
        defId: '6',
      },
      {
        wordId: 'WcUv4yNzAqRsFgDxJbKi',
        defId: '7',
      },
      {
        wordId: 'MlRn6oPqStVuZaXbYcDf',
        defId: '8',
      },
    ],
  },
  {
    id: 'tagId4',
    tag: 'mno',
    wordDefRefs: [
      {
        wordId: 'QwEr9TyU1iOp2AsDfGhJ',
        defId: '9',
      },
    ],
  },
];

it('should update the tag reference of the word', () => {
  const definitions = [
    {
      definitionId: '1',
      tags: ['tagId1', 'tagId2'],
    },
    {
      definitionId: '6',
      tags: ['tagId1'],
    },
  ];

  const targetDefId = '1';
  const newTagRefOfTheWord = ['tagId1', 'tagId3'];

  const result = updateDefRef(definitions, targetDefId, newTagRefOfTheWord);

  expect(result[0].tags).toEqual(newTagRefOfTheWord);
  expect(result[1].tags).toEqual(['tagId1']);
  expect(result.length).toEqual(2);
  expect(result[0].definitionId).toEqual('1');
  expect(result[1].definitionId).toEqual('6');
});

describe('getTagFullDataArray', () => {
  it('should return an array of tag data from tag ids', () => {
    const tagIdArray = ['tagId0', 'tagId4'];
    const result = getTagFullDataArray('id', tagIdArray, testTagList);
    expect(result[0].id).toEqual('tagId0');
    expect(result[1].id).toEqual('tagId4');
    expect(result.length).toEqual(2);
    expect(result[1].tag).toEqual('mno');
  });

  it('should return an array of tag data from tag names', () => {
    const tagNameArray = ['ghi', 'jkl'];
    const result = getTagFullDataArray('tag', tagNameArray, testTagList);
    expect(result[0].tag).toEqual('ghi');
    expect(result[1].tag).toEqual('jkl');
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual('tagId2');
    expect(result[1].id).toEqual('tagId3');
    expect(result[1].wordDefRefs.length).toEqual(3);
  });
});
