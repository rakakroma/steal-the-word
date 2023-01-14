export const allStyles = {
  default: {
    color: 'white',
    background: 'slategray',
  },
  style1: {
    color: 'black',
    background: '#d8d8d8',
  },
  style2: {
    color: 'white',
    background: 'linear-gradient(to right, #F27121cc, #E94057cc, #8A2387cc)',
  },
  style3: {
    background: 'linear-gradient(transparent 20%, #eea3a361 30%)',
  },
};

export const getTextStyleData = (styleName) => ({
  styleName,
  styles: allStyles[styleName],
});
