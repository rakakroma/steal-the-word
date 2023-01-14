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

export const OptionPopper = ({ filterStarsAndSetter }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
                      label: 'all',
                    },
                    {
                      value: 1,
                      label: <Star />,
                    },
                    {
                      value: 2,
                      label: (
                        <>
                          2
                          <Star />
                        </>
                      ),
                    },
                    {
                      value: 3,
                      label: (
                        <>
                          3
                          <Star />
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
