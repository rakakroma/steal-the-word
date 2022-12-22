import { rgbFromString } from '../../../../../../utilsForAll/rgbFromString';
export const colorStyles = {
  control: (styles) => {
    return {
      ...styles,
      border: 'none',
      boxShadow: 'none',
    };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const bgStringColor = rgbFromString(data.label, 0.1);
    const stringColor = rgbFromString(data.label);
    const lightStringColor = rgbFromString(data.label, 0.3);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? stringColor
        : isFocused
        ? bgStringColor
        : undefined,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? stringColor
          ? 'white'
          : 'black'
        : stringColor,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? stringColor
            : lightStringColor
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const bgStringColor = rgbFromString(data.label, 0.1);
    return {
      ...styles,
      backgroundColor: bgStringColor,
    };
  },
  multiValueLabel: (styles, { data }) => {
    const stringColor = rgbFromString(data.label);
    return {
      ...styles,
      color: stringColor,
    };
  },
  multiValueRemove: (styles, { data }) => {
    const lightStringColor = rgbFromString(data.label, 0.9);
    const lighterStringColor = rgbFromString(data.label, 0.5);

    return {
      ...styles,
      color: lightStringColor,
      ':hover': {
        backgroundColor: lighterStringColor,
        color: 'white',
      },
    };
  },
};
