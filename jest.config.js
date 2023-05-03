module.exports = {
  // 無関係のその他の設定は割愛

  transform: {
    '^.+\\.(j|t)sx?$': 'esbuild-jest', // js ファイルもトランスパイルの対象にしておく
  },
  transformIgnorePatterns: [`node_modules/(?!nanoid/)`], // nanoid をトランスパイルする
};
/* 
  https://beyooon.jp/blog/nanoid-v4-fails-jest/
   */
