module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'esbuild-jest',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(?:@?lit|nanoid/))
  `,
  ],
  testEnvironment: 'jsdom',
};
/* 
  https://beyooon.jp/blog/nanoid-v4-fails-jest/
   */
