export const zhTWTranslation = {
  button: {
    cancel: '取消',
    newWord: '儲存',
    editWord: '編輯',
    editContext: '編輯',
    deleting: '刪除',
    highlighting: '畫螢光線',
    contextHighlight: '畫螢光線',
    contextEdit: '編輯段落',
  },
  placeholder: {
    note: '筆記（需要的話）',
    annotation: '註解',
    variants: '詞的變異形（Enter以增加）',
    stem: '詞根',
    tagInput: '搜尋／儲存新標籤',
    context: '段落',
  },
  matchRule: {
    title: '比對規則',
    any: '任何情況',
    independent: '獨立單字',
    start: '起始端',
    end: '結尾端',
  },
  tooltipText: {
    addMatchRule: '新增比對規則',
    addNewContext: '加入當前段落',
    editWord: '編輯詞彙及註解',
    searchWord: '在新分頁 Google {{theWord}}',
    defaultMatchRuleExplanation: `此程式僅知道(1)是否有符合的字串、(2)該字串的前後是否有空白，你可以選擇不同的比對規則應用在你所輸入的詞彙及其變異形上。
    ❗: "詞根"指的是永遠使用起始端作為比對規則的字串。
    ❗: 所有（詞彙、詞根、詞的變異形）都會區分大小寫。

    `,
    CJKMatchRuleExplanation: `因為比對規則是看單字前後是否有空白，所以包含CJK文字（漢字、韓文）的字串僅適用"任何"作為比對規則`,
  },
};
