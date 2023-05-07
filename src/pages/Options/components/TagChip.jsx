import { Check, Close, Edit, Tag } from '@mui/icons-material';
import { Chip, IconButton, InputBase } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import { rgbFromString } from '../../../utilsForAll/rgbFromString';
import { db } from '../../Background/database';
import { TagListContext } from '../allContext';

export const TagLabelChip = ({
  tagLabel,
  notSmall,
  onClick,
  otherInfo,
  editable,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Chip
      icon={
        editable && isHovered ? (
          <Edit fontSize="13px" />
        ) : (
          <Tag fontSize="13px" />
        )
      }
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      size={notSmall ? undefined : 'small'}
      label={tagLabel}
      sx={{
        mr: 1,
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
    <TagLabelChip
      tagLabel={tagLabel}
      notSmall={true}
      onClick={handleEditTag}
      editable={true}
    />
  );
};
