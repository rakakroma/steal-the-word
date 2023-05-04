module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': 'esbuild-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!nanoid/)`],
};
/* 
  https://beyooon.jp/blog/nanoid-v4-fails-jest/
   */
