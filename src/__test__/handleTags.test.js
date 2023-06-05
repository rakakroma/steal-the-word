import {
  getExistingTagDataUpdateInfo,
  getShouldUpdateTagsFromDeleteDefs,
  getTagFullDataArray,
  updateTagsOfTargetDefinition,
  getShouldDeleteTags,
  getNewTagsAndOldTags,
} from '../utilsForAll/handleTags';
import { testTagList } from './testData';

it('should update the tag reference of specific word definition', () => {
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

  const result = updateTagsOfTargetDefinition(
    definitions,
    targetDefId,
    newTagRefOfTheWord
  );

  expect(result[0].tags).toEqual(newTagRefOfTheWord);
  expect(result[1].tags).toEqual(['tagId1']);
  expect(result.length).toEqual(2);
  expect(result[0].definitionId).toEqual('1');
  expect(result[1].definitionId).toEqual('6');
  expect(definitions).toEqual([
    {
      definitionId: '1',
      tags: ['tagId1', 'tagId2'],
    },
    {
      definitionId: '6',
      tags: ['tagId1'],
    },
  ]);
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

describe('getExistingTagDataUpdateInfo', () => {
  const refData = { wordId: 'wordId1', defId: 'defId0' };
  const refData2 = { wordId: 'wordId1231', defId: 'defId000' };

  const oldTags = [
    {
      id: 1,
      wordDefRefs: [
        { wordId: 'wordId1', defId: 'defId0' },
        { wordId: 'wordId9', defId: 'defId3' },
      ],
    },
    {
      id: 2,
      wordDefRefs: [],
    },
    { id: 3, wordDefRefs: [{ wordId: 'wordId1', defId: 'defId0' }] },
  ];

  it('only updated tags data return', () => {
    const result = getExistingTagDataUpdateInfo(oldTags, refData);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
    expect(result[0].wordDefRefs).toContainEqual(refData);

    const result2 = getExistingTagDataUpdateInfo(oldTags, refData2);
    expect(result2).toHaveLength(3);
    expect(result2[0].id).toBe(1);
    expect(result2[2].wordDefRefs).toHaveLength(2);
    expect(result2[2].wordDefRefs).toContainEqual(refData);
    expect(result2[2].wordDefRefs).toContainEqual(refData2);
  });
});

describe('getShouldUpdateTagsFromDeleteDefs', () => {
  const wordId = 'wordId1';
  const definitions = [
    {
      definitionId: 'defId0',
      tags: ['tagId1', 'tagId2'],
    },
    {
      definitionId: 'defId6',
      tags: ['tagId1'],
    },
  ];

  const currentTagList = [
    {
      id: 'tagId1',
      wordDefRefs: [
        { wordId: 'wordId1', defId: 'defId0' },
        { wordId: 'wordId1', defId: 'defId6' },
        { wordId: 'wordId9', defId: 'defId3' },
      ],
    },
    {
      id: 'tagId2',
      wordDefRefs: [{ wordId: 'wordId1', defId: 'defId0' }],
    },
    { id: 'tagId3', wordDefRefs: [{ wordId: 'wordId7', defId: 'defId7' }] },
  ];

  it('should return tagShouldBeDelete of tag data from tag ids', () => {
    const result = getShouldUpdateTagsFromDeleteDefs(
      wordId,
      definitions,
      currentTagList
    );
    expect(result.tagShouldBeDelete).toHaveLength(1);
    expect(result.tagShouldBeDelete[0]).toEqual('tagId2');
    expect(result.tagShouldUpdateItsRefs).toHaveLength(1);
    expect(result.tagShouldUpdateItsRefs[0].id).toEqual('tagId1');
    expect(result.tagShouldUpdateItsRefs[0].wordDefRefs).toHaveLength(1);
    expect(result.tagShouldUpdateItsRefs[0].wordDefRefs[0]).toEqual({
      wordId: 'wordId9',
      defId: 'defId3',
    });
  });
});

describe('getShouldDeleteTags', () => {
  const deletedTagObjs = [
    {
      id: 'tag1',
      tag: 'tag1',
      wordDefRefs: [{ wordId: 'word2', defId: 'def2' }],
    },
    {
      id: 'tag2',
      tag: 'tag2',
      wordDefRefs: [
        {
          wordId: 'word2',
          defId: 'def2',
        },
        {
          wordId: 'word3',
          defId: 'def3',
        },
      ],
    },
    {
      id: 'tag3',
      tag: 'tag3',
      wordDefRefs: [{ wordId: 'word6666', defId: 'def6666' }],
    },
  ];

  const refData = {
    wordId: 'word2',
    defId: 'def2',
  };

  it('should return an object with arrays of tag ids and references to delete', () => {
    const output = getShouldDeleteTags(deletedTagObjs, refData);
    expect(output.shouldDeleteTagIds).toHaveLength(1);
    expect(output.shouldDeleteTagIds[0]).toEqual('tag1');
    expect(output.updatedTagObjsOfShouldDeleteRef[0].wordDefRefs).toHaveLength(
      1
    );
    expect(output.updatedTagObjsOfShouldDeleteRef[0].wordDefRefs[0]).toEqual({
      wordId: 'word3',
      defId: 'def3',
    });
    expect(output.updatedTagObjsOfShouldDeleteRef).toHaveLength(2);
    expect(output.updatedTagObjsOfShouldDeleteRef[1].id).toBe('tag3');
    expect(output.updatedTagObjsOfShouldDeleteRef[1].wordDefRefs).toEqual([
      { wordId: 'word6666', defId: 'def6666' },
    ]);
  });
});

describe('getNewTagsAndOldTags', () => {
  const fakeTagList = [
    {
      id: 'tagId1',
      tag: 'tag1',
      wordDefRefs: [{ wordId: 'word2', defId: 'def2' }],
    },
    {
      id: 'tagId2',
      tag: 'tag2',
      wordDefRefs: [{ wordId: 'word1', defId: 'def6' }],
    },
  ];

  const fakeTagsData = [
    { label: 'tag1', value: 'tagId1' },
    { label: 'tag2', value: 'tagId2' },
    { label: 'tag3', value: 'tagId3' },
  ];

  const fakeRefData = {
    wordId: 'word7',
    defId: 'def3',
  };

  it('check getNewTagsAndOldTags', () => {
    const result = getNewTagsAndOldTags(fakeTagsData, fakeRefData, fakeTagList);

    expect(result.newTagObjs).toHaveLength(1);
    expect(result.newTagObjs[0].tag).toBe('tag3');
    expect(result.notNewTagIds).toHaveLength(2);
    expect(result.notNewTagIds).toContain('tagId1');
    expect(result.notNewTagIds).toContain('tagId2');

    expect(result.tagIdArrayForDef).toHaveLength(3);
    expect(result.tagIdArrayForDef).toContain('tagId1');
    expect(result.tagIdArrayForDef).toContain('tagId2');
  });
});
