import {
  Box,
  Slider,
  Fade,
  Popper,
  IconButton,
  ClickAwayListener,
} from '@mui/material';
import React, { useState } from 'react';
import { FilterAlt, Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SmallSizeStar = () => <Star fontSize="16" />;

export const OptionPopper = ({ filterStarsAndSetter }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { t } = useTranslation();

  const handleClick = (event) => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
    }
    setOpen(!open);
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <div>
        <IconButton onClick={handleClick}>
          <FilterAlt />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement="bottom-end"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  boxShadow: 1,
                  p: 2,
                  bgcolor: 'background.paper',
                  minWidth: '190px',
                  height: '70px',
                }}
              >
                <Slider
                  sx={{ minWidth: '170px' }}
                  value={filterStarsAndSetter.filterStars}
                  onChange={(e) =>
                    filterStarsAndSetter.setFilterStars(e.target.value)
                  }
                  defaultValue={0}
                  // valueLabelFormat={}
                  step={1}
                  valueLabelDisplay="auto"
                  min={0}
                  max={3}
                  marks={[
                    {
                      value: 0,
                      label: t('all'),
                    },
                    {
                      value: 1,
                      label: <SmallSizeStar />,
                    },
                    {
                      value: 2,
                      label: (
                        <>
                          2
                          <SmallSizeStar />
                        </>
                      ),
                    },
                    {
                      value: 3,
                      label: (
                        <>
                          3
                          <SmallSizeStar />
                        </>
                      ),
                    },
                  ]}
                />
              </Box>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
