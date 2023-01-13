import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import { DomainAndLinkListContext } from '../../Options';
import React from 'react';
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { RemoveCircleOutlineRounded } from '@mui/icons-material';
import { formatBytes } from '../../utils/formatBytes';

const ChildModal = ({ params }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [open, setOpen] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [uploadedImgSize, setUploadedImgSize] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUploadedImg(null);
  };

  const logFile = (event) => {
    let str = event.target.result;
    // let json = JSON.parse(str);
    // console.log('string', str);
    // console.log('json', json);
    // db.wordList.bulkAdd(json)
    // setMyList(json)
    // chrome.storage.local.set({ "myWordList": json });
  };

  const handleImageUpload = (e) => {
    // console.log('ha')
    // // e.preventDefault()
    // // if (!file.value.length) return;
    // let reader = new FileReader()
    // let file = e.target.files[0]
    // if (!e.target.files[0]) return
    // // reader.onload = e.target.result;
    // // reader.readAsText(file.files[0]);
    // reader.onloadend = () => {
    //   reader.readAsDataURL(file)
    // }

    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setUploadedImg(URL.createObjectURL(uploadedFile));
      setUploadedImgSize(uploadedFile.size);
    }
  };
  return (
    <React.Fragment>
      <img
        onClick={handleOpen}
        width="20px"
        height="20px"
        loading="lazy"
        src={params.value}
      />
      {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <Typography variant="h6" id="child-modal-title">
            原圖
          </Typography>
          <Box
            sx={{
              width: '64px',
              height: '64px',
            }}
          >
            {params.value ? (
              <img
                width="64px"
                height="64px"
                src={params.value}
                alt="無法顯示"
              />
            ) : (
              '無'
            )}
          </Box>
          <Typography variant="h6" id="child-modal-title">
            上傳圖
            <Typography variant="subtitle2" component="span">
              {uploadedImgSize ? formatBytes(uploadedImgSize) : ''}
            </Typography>{' '}
          </Typography>
          <Box
            sx={{
              width: '64px',
              height: '64px',
              position: 'relative',
            }}
          >
            {uploadedImg ? (
              <>
                {' '}
                <img
                  width="64px"
                  height="64px"
                  src={uploadedImg}
                  alt="尚未上傳"
                />
                <IconButton
                  aria-label="delete this pic"
                  onClick={() => {
                    setUploadedImg(null);
                    setUploadedImgSize(null);
                  }}
                  sx={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-8px',
                    backgroundColor: (theme) => theme.palette.grey[500],
                    padding: 0,
                    color: 'white',
                  }}
                >
                  <RemoveCircleOutlineRounded />
                </IconButton>
              </>
            ) : (
              '無'
            )}
          </Box>
          {uploadedImg ? (
            ''
          ) : (
            <Input
              name="img-upload"
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => handleImageUpload(e)}
            />
          )}
          <Button variant="outlined" onClick={handleClose}>
            取消
          </Button>
          <Button variant="contained" onClick={handleClose}>
            確認
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export const SiteDataGrid = () => {
  const domainAndLinkList = useContext(DomainAndLinkListContext);

  if (!domainAndLinkList) return null;
  const domainAndLinkCols = [
    {
      field: 'url',
      headerName: 'url',
      width: 200,
      renderCell: (params) => (
        <a target="_blank" rel="noreferrer" href={'https://' + params.value}>
          {params.value}
        </a>
      ),
    },
    // {
    //   field: 'dynamicRendering',
    //   headerName: '動態更新',
    //   width: 50,
    //   type: 'boolean',
    //   editable: true,
    // },
    {
      field: 'icon',
      headerName: '圖示',
      width: 50,
      renderCell: (params) => <ChildModal params={params} />,
      getApplyQuickFilterFn: undefined,
    },
    // {
    //   field: 'tags',
    //   headerName: 'tags',
    //   width: 1000,
    //   // flex: 0.2,
    //   // minWidth: 150,
    //   renderCell: (params) => (
    //     <Autocomplete
    //       multiple
    //       // id="tags-filled"
    //       options={['a', 'b', 'c']}
    //       defaultValue={['a']}
    //       freeSolo
    //       renderTags={(value, getTagProps) =>
    //         value.map((option, index) => (
    //           <Chip
    //             variant="outlined"
    //             label={option}
    //             {...getTagProps({ index })}
    //           />
    //         ))
    //       }
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant="filled"
    //           // label="ok"
    //           placeholder="tags"
    //         />
    //       )}
    //     />
    //   ),
    // },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        rows={domainAndLinkList}
        columns={domainAndLinkCols}
      />
    </div>
  );
};
