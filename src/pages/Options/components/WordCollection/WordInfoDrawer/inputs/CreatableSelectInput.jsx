import TagIcon from '@mui/icons-material/Tag';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { colorStyles } from './selectableInputStyle';

export const convertValueToFitCreatableInput = (array) => {
  return array.map((value) => {
    return {
      label: value,
      value,
    };
  });
};

const sameDataValue = (targetArray, newData) => {
  return (
    targetArray.findIndex(
      (dataInTarget) => dataInTarget.value === newData.value
    ) > -1
  );
};

const createOption = (label) => ({
  label: label.trim(),
  value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
  createOption('One'),
  createOption('Two'),
  createOption('Three'),
];

export const CreatableSelectInput = ({
  name,
  allOptions,
  selectedOptions,
  placeholder,
}) => {
  const [options, setOptions] = useState(allOptions || defaultOptions);

  const CustomPlaceHolder = () => {
    return (
      // <Chip
      //   sx={{
      //     position: 'absolute',
      //     left: '5px',
      //     bgcolor: rgbFromString('addtags', 0.1),
      //     color: rgbFromString('addtags'),
      //     '&:focus-within': {
      //       bgcolor: rgbFromString('addtags', 0.4),
      //     },
      //   }}
      //   label="add tags"
      //   variant="filled"
      //   size="small"
      // />
      <>
        <TagIcon />
      </>
    );
  };
  const components = {
    DropdownIndicator: null,
    // Placeholder: CustomPlaceHolder,
  };

  const handleChange = (field, newValue) => {
    if (newValue.length < field.value.length) {
      //change to delete tag
      field.onChange(newValue);
      return;
    }
    if (newValue.length === field.value.length) {
      return;
    }
    const latestValue = newValue[newValue.length - 1];
    const newOption = createOption(latestValue.label);
    if (sameDataValue(field.value, newOption)) return; //tag already selected
    if (latestValue['__isNew__']) {
      setOptions(options.concat([newOption]));
      const newResult = [...newValue]
        .slice(0, newValue.length - 1)
        .concat([newOption]);
      field.onChange(newResult);
      return;
    }
    field.onChange(newValue);
  };

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      // defaultValue={selectedOptions}
      name={name}
      render={({ field }) => (
        <CreatableSelect
          autoFocus
          components={components}
          ref={field.ref}
          isClearable
          isMulti
          onChange={(newValue) => handleChange(field, newValue)}
          placeholder={placeholder || '#add tags..'}
          value={options.filter((option) => {
            return (
              field.value.findIndex(
                (fieldValue) => fieldValue.value === option.value
              ) > -1
            );
          })}
          options={options}
          styles={colorStyles}
        />
      )}
    />
  );
};

export const CreatableTextInput = ({ name, placeholder }) => {
  const createOption = (label) => ({
    label,
    value: label.trim(),
  });

  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event, field) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        event.preventDefault();
        const newOption = createOption(inputValue);
        if (sameDataValue(field.value, newOption)) return; //error message
        field.onChange([...field.value, newOption]);
        setInputValue('');
        break;
      default:
        break;
    }
  };

  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CreatableSelect
          components={{
            DropdownIndicator: null,
          }}
          isClearable
          isMulti
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          menuIsOpen={false}
          inputValue={inputValue}
          onInputChange={(newValue) => setInputValue(newValue)}
          onKeyDown={(event) => handleKeyDown(event, field)}
          placeholder={placeholder}
          value={field.value}
        />
      )}
    />
  );
};
