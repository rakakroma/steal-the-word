export const groupBy = (array, property) => {
  return array.reduce((acc, currentValue) => {
    const key = currentValue[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(currentValue);
    return acc;
  }, {});
};
