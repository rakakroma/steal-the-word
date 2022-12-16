export const rgbFromString = (str, alpha) => {
  const charCodeRemainder =
    str.split('').reduce((acc, char) => acc + char.charCodeAt(0) * 13, 55) %
    256;

  const maxValue = 150; // one of three rgb code should under maxValue, make sure it's relatively dark.

  const threeNum = [
    charCodeRemainder % 256,
    (charCodeRemainder + str.length * 7) % 256,
    (charCodeRemainder + str.charCodeAt(0) * 3 + 32) % maxValue,
  ];

  const firstIndex = charCodeRemainder % 3;
  const firstNum = threeNum[firstIndex];
  const twoNum = threeNum.filter((num) => num !== firstNum);
  const secondIndex = str.length % 2;
  const secondNum = twoNum[secondIndex];
  const oneNum = twoNum.filter((num) => num !== secondNum);

  const resultNum = [firstNum, secondNum, oneNum[0]];
  // return `${resultNum[0]}, ${resultNum[1]}, ${resultNum[2]} `;
  return `rgba(${resultNum[0]}, ${resultNum[1]}, ${resultNum[2]}, ${
    alpha || 1
  })`;
};
