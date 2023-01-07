import React from 'react';
import { useState } from 'react';
import { Rating } from '@mui/material';
import { useEffect } from 'react';
import styled from '@emotion/styled';
import { db } from '../../../../Background/database';

export const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});
export const WordRating = ({ targetWord }) => {
  const [ratingStars, setRatingStars] = useState(0);

  useEffect(() => {
    setRatingStars(targetWord?.stars || 0);
  }, [targetWord]);

  const updateWordRatingInDb = (value) => {
    db.wordList.update({ id: targetWord.id }, { stars: value });
    // .then((updated) => {
    //   if (updated) console.log(`update ${targetWord.id} to ${value} stars`);
    //   else console.log('Nothing was updated');
    // });
  };
  const handleWordRating = (e, newValue) => {
    if (newValue === null) {
      setRatingStars(0);
      updateWordRatingInDb(0);
      return;
    }
    setRatingStars(newValue);
    updateWordRatingInDb(newValue);
  };

  return (
    <StyledRating
      defaultValue={0}
      value={ratingStars}
      max={3}
      onChange={handleWordRating}
    />
  );
};
