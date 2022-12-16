import { Chip, IconButton, InputBase } from '@mui/material';
import { useContext, useState } from 'react';
import { TagListContext } from '../Options';
import { rgbFromString } from '../utils/rgbFromString';
import React from 'react';
import { Check, Close, Edit, Tag } from '@mui/icons-material';
import { Box } from '@mui/system';
import { db } from '../../Background/database';

export const TagLabelChip = ({ tagLabel, notSmall, onClick, otherInfo }) => {
  return (
    <Chip
      icon={<Tag fontSize="13px" />}
      onClick={onClick}
      size={notSmall ? undefined : 'small'}
      label={tagLabel}
      sx={{
        mr: 1,
        // color: rgbFromString(tag),
        backgroundColor: rgbFromString(tagLabel, 0.1),
      }}
    />
  );
};

export const TagChip = ({ tagId }) => {
  const tagList = useContext(TagListContext);
  const tagData = tagList.find((tagData) => tagData.id === tagId);
  return <TagLabelChip tagLabel={tagData.tag} />;
};

export const EditableTagChip = ({ tagLabel, tagId }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(tagLabel);
  const newValue = value.trim();
  const newValueIsQualified = newValue.length > 0 && newValue !== tagLabel;
  const handleEditTag = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setValue(tagLabel);
    setEditing(false);
  };

  const handleSubmitEdit = () => {
    if (newValueIsQualified) {
      db.tagList.update(tagId, { tag: newValue });
      setEditing(false);
      return;
    }
  };

  if (editing)
    return (
      <Box>
        <InputBase
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          sx={{ backgroundColor: rgbFromString(value, 0.1), borderRadius: 2 }}
        />
        <IconButton size="small" onClick={handleCancelEdit}>
          <Close />
        </IconButton>
        <IconButton
          color="success"
          size="small"
          onClick={handleSubmitEdit}
          disabled={!newValueIsQualified}
        >
          <Check />
        </IconButton>
      </Box>
    );
  return (
    <Box>
      <TagLabelChip
        tagLabel={tagLabel}
        notSmall={true}
        onClick={handleEditTag}
      />
      {/* <IconButton size="small" onClick={handleEditTag}>
        <Edit />
      </IconButton> */}
    </Box>
  );
};
