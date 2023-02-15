export const jaTranslation = {
  button: {
    cancel: 'キャンセル',
    newContext: '保存',
    newWord: '保存',
    editWord: '編集',
    editContext: '編集',
    deleting: '削除',
    highlighting: 'ハイライト',
    contextHighlight: 'ハイライト',
    contextEdit: '文脈編集',
  },
  placeholder: {
    note: 'ノート (任意)',
    annotation: '注釈',
    variants: '変異形 (enterで複数を入力)',
    stem: '語幹',
    tagInput: 'タグを選択や入力して',
    context: '文脈',
  },
  matchRule: {
    title: 'マッチルール',
    start: '単語のスタート',
    end: '単語のエンド',
    independent: '独立の単語',
    any: '任意',
  },
  tooltipText: {
    addMatchRule: 'マッチルールを追加',
    addNewContext: 'ここの文脈で追加',
    editWord: '単語と注釈を編集',
    searchWord: '新規タブで {{theWord}} をグーグルする',
    defaultMatchRuleExplanation: `
    このアプリは「その文字列がここにあるのか」と「この文字列はスペースに囲まれるているのか」ということが検査しています。希望のマッチルールを選択して、ここで入力した単語、変異形、語幹に適用してください。
    ❗: 語幹は、「単語のスタート」をマッチルールをする文字列です.
    ❗: 単語、変異形、語幹は全部大文字と小文字を識別する.

    `,
    CJKMatchRuleExplanation: ` CJK (漢字と韓国語の文字)、タイ語文字、ジャワ文字はいつも「任意」のマッチルールを適用しています.`,
  },
};
