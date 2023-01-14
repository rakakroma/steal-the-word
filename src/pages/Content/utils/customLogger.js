export const myLog = (...args) => {
  if (process.env.NODE_ENV === 'production') {
    return () => {};
  }
  return console.log(...args);
};
