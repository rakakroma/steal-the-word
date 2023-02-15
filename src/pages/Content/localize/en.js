export const enTranslation = {
  button: {
    cancel: 'Cancel',
    newContext: 'Save',
    newWord: 'Save',
    editWord: 'Edit',
    editContext: 'Edit',
    deleting: 'Delete',
    highlighting: 'Highlight',
    contextHighlight: 'highlight context',
    contextEdit: 'edit context',
  },
  placeholder: {
    note: 'note (optional)',
    annotation: 'annotation',
    variants: 'variants (enter to add more)',
    stem: 'stem',
    tagInput: 'search/create new tag',
    context: 'context',
  },
  matchRule: {
    title: 'Match Rule',
    any: 'any',
    independent: 'independent',
    start: 'start',
    end: 'end',
  },
  tooltipText: {
    addMatchRule: 'add match rule',
    addNewContext: 'add new context',
    editWord: 'edit word and annotation',
    searchWord: 'Google {{theWord}} in new tab',
    defaultMatchRuleExplanation: `This app only knows if the string is matched, and if there are spaces next to it. 
    Please select the match rule and it will apply on the word and the variants you provided.
    ❗: "stem" means the text string that always use 'start' as its match rule.
    ❗: "stem", "word" and "variants" are all case sensitive.
    `,
    CJKMatchRuleExplanation: `Text string contains CJK (Chinese /Japanese/ Korean) characters, Thai characters and Javanese characters always use 'any' as match rule.`,
  },
};
