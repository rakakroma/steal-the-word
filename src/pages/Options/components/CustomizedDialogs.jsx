import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkIcon from '@mui/icons-material/Link';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  FormHelperText,
  Checkbox,
  Box,
  Tab,
  Tabs,
  Input,
  Link,
  Divider,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  TextField,
  Modal,
  Icon,
} from '@mui/material';
import { TabsContext } from '@mui/base';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextFormatRounded } from '@mui/icons-material';
import { display } from '@mui/system';
import { defaultRubyStyle } from './defaultRuby.style';
import { db } from '../../Background/database';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getDataInTableFromIndexedDB } from '../utils/getDataFromDB';
// import { getDomain } from '../utils/transformData';
import { formatBytes } from '../utils/formatBytes';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

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
                  <RemoveCircleOutlineRoundedIcon />
                </IconButton>
              </>
            ) : (
              '無'
            )}
          </Box>
          {/* <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p> */}
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs({
  wordList,
  domainAndLinkList,
  handleExport,
  handleImport,
  contextList,
  setMyList,
}) {
  const [open, setOpen] = useState(false);
  // const [domainAndLinkListFromLS, setDomainAndLinkListFromLS] = useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [setting, setSetting] = useState({
    buttonAfterSelection: true,
    contextMenuButton: true,
    showButtonUsingHotKey: false,
    taiwanese: true,
    hakkaSixian: true,
    hakkaHailu: false,
    hakkaDapu: false,
    hakkaRaoping: false,
  });

  const [customRubyStyle, setCustomRubyStyle] = useState(defaultRubyStyle);

  const handleChange = (event) => {
    console.log(event.target.name);
    setSetting({
      ...setting,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeRubyStyle = (event, value) => {
    setCustomRubyStyle({
      ruby: {
        ...customRubyStyle.ruby,
        [event.target.name]: value || event.target.value,
      },
      rt: {
        ...customRubyStyle.rt,
      },
    });
  };

  const handleChangeRtStyle = (event, value) => {
    setCustomRubyStyle({
      ruby: {
        ...customRubyStyle.ruby,
      },
      rt: {
        ...customRubyStyle.rt,
        [event.target.name]: value || event.target.value,
      },
    });
  };
  const {
    buttonAfterSelection,
    contextMenuButton,
    showButtonUsingHotKey,
    taiwanese,
    hakkaSixian,
    hakkaHailu,
    hakkaDapu,
    hakkaRaoping,
  } = setting;

  const [currentTab, setCurrentTab] = useState('2');
  const handleChangeTab = (e, newTab) => {
    setCurrentTab(newTab);
  };

  // const handleSaveLocalStorageWordsToIndexedDB = () => {
  //   const listInDbFormat = contextList.sort((a, b) => +a.date - +b.date)
  //   db.wordList.bulkAdd(listInDbFormat)
  //   console.log('done save');
  // }

  const allDomains = contextList.reduce((acc, curr) => {
    const currentDomain = new URL(curr.url).hostname;
    if (!acc.includes(new URL(curr.url).hostname)) {
      acc.push(currentDomain);
    }
    return acc;
  }, []);

  const getFaviconFromDomain = async (domain) => {
    if (domain[domain.length - 1] === ':') return null;

    const domainFaviconUrl = (domain) => {
      return `https://${domain}/favicon.ico`;
    };
    const googleFavicon = (domain) => {
      return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`;
    };

    let res;
    let blob;
    try {
      res = await fetch(domainFaviconUrl(domain));
      blob = await res.blob();
      if (!res.ok || res.status === 404 || !blob.type.includes('image')) {
        res = await fetch(googleFavicon(domain));
        blob = await res.blob();
        if (!res.ok || res.status === 404 || !blob.type.includes('image')) {
          res = '';
          blob = '';
        }
      }
    } catch (err) {
      console.log('1', err);
    }
    // if (!res) {
    //   blob = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAhZJREFUaEPt2M/rTFEYx/HXV34lJSs2/gBC7NlY8RcoVgqxsBClpFB+pJBsSFgh/4OF2LMjhZWsLZTfoafu1HTdmXvu3JkzfXXOarr3PD/ez+c55545Cxb5WFjk+SsA81awKFAU6FmB0kI9C9jbPFWBCziBlb0jpjn4hms40zY9BWAHnjOXb8YuPB0H0QawFC+wta0SM3r/Gtvwc5T/NoBom6uV8WdsxMcZJTtwux5vsKZ6EDlcnwSgk6MpQyUXbpwCD7GvSqxVyikD1Fv3EfY3xRgFUF+4rYtpygDhbieeDW0ejTk0ASzDS2yukvqAO9iEqEyO8Quh+mFsqAK+wvb6gm4CCKke5MhyghiHcHfYrglgLx5P4DyHyUHcawOI9wERcg3GqaHfV2ac6ahY0VLRGb9TAOo5/hl60Pbt6MvXKVZqMp2c9iToFKsA9Kx2k3kWBdbhCbYkALzHbrzDpepYvrxmNzwnC8AB3E9IfjDlNC4jDoSrR9gNDm1ZAI7gVgeA8ziHiziJugJvsQehRHaA2zjaABMJn62eDwBSmAtAys4w3EJFgVrFSguVFqoqUHahlLuoSQ9zZRca80Uru9B/vwt9wgqsSjnYVHPitvlr4vy1Xf6+pi7iH4j7opwjLnTrp9Z/4qcC3MAxLMlEEDcPN3G8LV4qQPiJlonWyTG+40tKoC4AKf6yzykA2UteC1gUmLcCfwGZvpsxpvvc8AAAAABJRU5ErkJggg=='
    // }

    console.log(blob);

    return blob;
  };

  const handleDomainsToIndexedDB = async () => {
    const arraysToAdd = await Promise.all(
      allDomains.map(async (domain) => {
        return {
          url: domain,
          dynamicRendering: 'O',
          showTabWords: null,
          icon: await getFaviconFromDomain(domain),
          tags: null,
        };
      })
    );
    // db.domainAndLink.bulkAdd(arraysToAdd)
    // console.log(arraysToAdd);
    return arraysToAdd;
  };

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
    {
      field: 'dynamicRendering',
      headerName: '動態更新',
      width: 50,
      type: 'boolean',
      editable: true,
    },
    {
      field: 'icon',
      headerName: '圖示',
      width: 50,
      renderCell: (params) => <ChildModal params={params} />,
      getApplyQuickFilterFn: undefined,
    },
    {
      field: 'tags',
      headerName: 'tags',
      width: 1000,
      // flex: 0.2,
      // minWidth: 150,
      renderCell: (params) => (
        <Autocomplete
          multiple
          // id="tags-filled"
          options={['a', 'b', 'c']}
          defaultValue={['a']}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              // label="ok"
              placeholder="tags"
            />
          )}
        />
      ),
    },
  ];

  const deleteAllWordsInDB = () => {
    if (window.confirm(`確定刪除共${contextList.length}個詞彙？`)) {
      db.wordList.clear();
      // setMyList(null)
    }
    // db.contextList.clear()
  };

  const handleSaveImagesToIndexedDB = async () => {
    console.log('start');
    // const k = async () => {console.log('hi', await domainWithIcon(allDomains))}
    // let result = await domainWithIcon(allDomains)
    let result = await handleDomainsToIndexedDB();
    console.log(result);
    console.log('end');
    db.domainAndLink.bulkAdd(result);
    console.log('added');
  };

  const saveCurrentWordsListToDB = () => {
    // const editedList = wordList.map(wordObj => {
    //   const findWord = oldData.find(oldWordObj => oldWordObj.id === wordObj.id)
    //   wordObj.definitions[0].aliases = [findWord.alias]
    //   return wordObj
    // })
    // console.log(editedList)
    // db.wordList.bulkAdd(editedList)
    // console.log('added')
  };

  return (
    <div>
      <Button
        sx={{ color: 'whitesmoke', borderColor: 'whitesmoke' }}
        variant="outlined"
        onClick={handleClickOpen}
      >
        <SettingsIcon />{' '}
      </Button>
      <BootstrapDialog
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modal title
        </BootstrapDialogTitle> */}

        <DialogContent>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={currentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label="設定"
                    icon={<SettingsIcon />}
                    iconPosition="end"
                    value="1"
                  />
                  <Tab
                    label="樣式"
                    icon={<TextFormatRounded />}
                    iconPosition="end"
                    value="2"
                  />
                  <Tab
                    label="匯入／匯出"
                    icon={<ImportExportIcon />}
                    iconPosition="end"
                    value="3"
                  />
                  <Tab
                    label="網域／包含網址片段設定"
                    icon={<LinkIcon />}
                    iconPosition="end"
                    value="4"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                {/* <Typography variant='h5'>使用方式</Typography> */}
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend">使用方式</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={buttonAfterSelection}
                          onChange={handleChange}
                          name="buttonAfterSelection"
                        />
                      }
                      label="選取文字後自動出現按鈕"
                    />
                    <FormHelperText>
                      ⚠️不少網站（如Yahoo!ニュース）及Edge瀏覽器在選取文字後會出現功能鍵（Edge可從設定中關閉），
                      與本功能觸發機制相似，若一併使用會導致畫面複雜，
                      較容易誤觸及需按兩次（Edge）才能生效。
                    </FormHelperText>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={contextMenuButton}
                          onChange={handleChange}
                          name="contextMenuButton"
                        />
                      }
                      label="選取文字後右鍵選單傳入編輯框"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showButtonUsingHotKey}
                          onChange={handleChange}
                          name="showButtonUsingHotKey"
                        />
                      }
                      label="選取後使用熱鍵(hotkey)傳入編輯框"
                    />
                  </FormGroup>
                </FormControl>
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend">讀音快速查詢鍵</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox
                          checked={taiwanese}
                          onChange={handleChange}
                          name="taiwanese"
                        />
                      }
                      label="台語"
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox
                          checked={hakkaSixian}
                          onChange={handleChange}
                          name="hakkaSixian"
                        />
                      }
                      label="四縣"
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox
                          checked={hakkaHailu}
                          onChange={handleChange}
                          name="hakkaHailu"
                        />
                      }
                      label="海陸"
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox
                          checked={hakkaDapu}
                          onChange={handleChange}
                          name="hakkaDapu"
                        />
                      }
                      label="大埔"
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox
                          checked={hakkaRaoping}
                          onChange={handleChange}
                          name="hakkaRaoping"
                        />
                      }
                      label="饒平"
                    />
                  </FormGroup>
                </FormControl>
              </TabPanel>
              <TabPanel value="2">
                <FormControlLabel
                  control={
                    <Switch
                      disabled={
                        customRubyStyle.rt.display === 'none' ? true : false
                      }
                      size="small"
                      checked={customRubyStyle.ruby.rubyPosition === 'under'}
                      onChange={(e) => {
                        customRubyStyle.ruby.rubyPosition === 'under'
                          ? handleChangeRubyStyle(e, 'over')
                          : handleChangeRubyStyle(e, 'under');
                      }}
                    />
                  }
                  label="小字位置"
                  name="rubyPosition"
                />

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={customRubyStyle.rt.display === 'none'}
                      onChange={(e) => {
                        customRubyStyle.rt.display === 'none'
                          ? handleChangeRtStyle(e, 'block')
                          : handleChangeRtStyle(e, 'none');
                      }}
                    />
                  }
                  label="隱藏小字"
                  name="display"
                />
                <Box sx={{ display: 'flex' }}>
                  <Box>
                    <Typography variant="h6">設定rt樣式</Typography>
                    <FormGroup row>
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Input
                            disabled={
                              customRubyStyle.rt.display === 'none'
                                ? true
                                : false
                            }
                            sx={{ width: '15px', height: '15px' }}
                            type="color"
                            value={customRubyStyle.rt.backgroundColor}
                            onChange={(e) => handleChangeRtStyle(e)}
                            name="backgroundColor"
                          />
                        }
                        label="背景"
                      />
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Input
                            disabled={
                              customRubyStyle.rt.display === 'none'
                                ? true
                                : false
                            }
                            sx={{ width: '15px', height: '15px' }}
                            type="color"
                            value={customRubyStyle.rt.color}
                            onChange={(e) => handleChangeRtStyle(e)}
                            name="color"
                          />
                        }
                        label="顏色"
                      />

                      {/* <InputLabel >underline</InputLabel> */}
                      <Select
                        disabled={
                          customRubyStyle.rt.display === 'none' ? true : false
                        }
                        size="small"
                        // labelId="demo-simple-select-label"
                        // id="demo-simple-select"
                        value={customRubyStyle.rt.textDecoration}
                        // label="Age"
                        onChange={(e) => {
                          handleChangeRtStyle(e);
                        }}
                        name="textDecoration"
                      >
                        <MenuItem value="">none</MenuItem>
                        <MenuItem value="underline">underline</MenuItem>
                        <MenuItem value="underline dotted">dotted</MenuItem>
                        <MenuItem value="underline wavy">wavy</MenuItem>
                      </Select>
                    </FormGroup>

                    <Typography variant="h6">設定ruby樣式</Typography>
                    <FormGroup row>
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Input
                            sx={{ width: '15px', height: '15px' }}
                            type="color"
                            value={customRubyStyle.ruby.color}
                            onChange={(e) => handleChangeRubyStyle(e)}
                            name="color"
                          />
                        }
                        label="字體顏色"
                      />
                      <FormControlLabel
                        labelPlacement="start"
                        control={
                          <Input
                            sx={{ width: '15px', height: '15px' }}
                            type="color"
                            value={customRubyStyle.ruby.backgroundColor}
                            onChange={(e) => handleChangeRubyStyle(e)}
                            name="backgroundColor"
                          />
                        }
                        label="背景顏色"
                      />
                      {/* <InputLabel id="demo-simple-select-label">underline</InputLabel> */}
                      <Select
                        size="small"
                        // labelId="demo-simple-select-label"
                        // id="demo-simple-select"
                        value={customRubyStyle.ruby.textDecoration}
                        // label="Age"
                        onChange={(e) => {
                          handleChangeRubyStyle(e);
                        }}
                        name="textDecoration"
                      >
                        <MenuItem value="">none</MenuItem>
                        <MenuItem value="underline">underline</MenuItem>
                        <MenuItem value="underline dotted">dotted</MenuItem>
                        <MenuItem value="underline wavy">wavy</MenuItem>
                      </Select>
                    </FormGroup>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '40px',
                    }}
                  >
                    <Typography variant="h3">
                      <ruby style={customRubyStyle.ruby}>
                        你好<rt style={customRubyStyle.rt}>lí hó</rt>
                      </ruby>
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ m: 3 }}></Divider>
                <Typography variant="body1" gutterBottom>
                  食著藥，青草一葉；食毋著藥，
                  <ruby style={customRubyStyle.ruby}>
                    人參<rt style={customRubyStyle.rt}>jîn-sim</rt>
                  </ruby>
                  一石。 Tsia̍h tio̍h io̍h, tshinn-tsháu tsi̍t hio̍h; tsia̍h m̄-tio̍h
                  io̍h,
                  <ruby style={customRubyStyle.ruby}>
                    jîn-sim<rt style={customRubyStyle.rt}>人參</rt>
                  </ruby>{' '}
                  tsi̍t tsio̍h. 鼻は
                  <ruby style={customRubyStyle.ruby}>
                    人参<rt style={customRubyStyle.rt}>にんじん</rt>
                  </ruby>
                  のようだ。
                  <ruby style={customRubyStyle.ruby}>
                    인삼<rt style={customRubyStyle.rt}>人参</rt>
                  </ruby>
                  을 밭에서 대량으로 수확했다. • The company does not sell its
                  products outside its own stores and buys
                  <ruby style={customRubyStyle.ruby}>
                    ginseng
                    <rt style={customRubyStyle.rt}>
                      root been used in traditional medicine
                    </rt>
                  </ruby>
                  from wholesalers, Miller said.
                </Typography>

                {/* <Typography variant='h6' gutterBottom>ruby背景顏色</Typography> */}
              </TabPanel>

              <TabPanel value="3">
                {/* <form onSubmit={handleImport}>
                  <FormControl sx={{ m: 3 }} component="fieldset" variant='standard' >
                    <FormLabel component='legend'>匯入</FormLabel>
                    <Input type='file' inputProps={{ accept: '.json' }} />
                    <FormHelperText>⚠️注意：資料格式為json，匯入後將取代原本清單</FormHelperText>
                    <Button>匯入</Button>
                  </FormControl>
                </form> */}

                <Link
                  href={handleExport(contextList).link}
                  download={handleExport(contextList).fileName}
                >
                  下載單字清單
                </Link>
                <button onClick={deleteAllWordsInDB}>刪除所有words</button>
                <form id="upload" onSubmit={handleImport}>
                  <label htmlFor="file">上傳資料（json）</label>
                  <input type="file" id="file" accept=".json" />
                  {/* <Input type='file' inputProps={{ accept: '.json' }} /> */}
                  <button>匯入</button>
                </form>
                {/* <div>注意：匯入資料將取代原本清單</div> */}
                {/* <a
                href={handleExport('href')} 
                download={handleExport('download')}
                >下載單字清單</a> */}

                {/* <button onClick={handleSaveImagesToIndexedDB}>把圖存到IndexedDB</button> */}
                <button onClick={saveCurrentWordsListToDB}>
                  把新words存到IndexedDB
                </button>

                {/* <button onClick={handleSaveLocalStorageWordsToIndexedDB}>把LocalStorage的單字存到IndexedDB</button> */}
                {/* <button onClick={handleDomainsToIndexedDB}>把加好的網域存到IndexedDB</button> */}
                {/* <Link href={handleExport(domainWithIcon).link}
                  // download={handleExport(domainWithIcon).fileName}
                  download={'test123'}

                >下載網域和圖</Link> */}
              </TabPanel>

              <TabPanel value="4">
                {/* <button onClick={getDomainAndLinkListFromIndexedDB}>顯示indexedDB裡的</button> */}
                <Typography>hihi</Typography>
                <Link
                  href={handleExport(domainAndLinkList).link}
                  download={'domainAndLinkList HolliRuby'}
                >
                  下載domainAndLinkList
                </Link>

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
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            完成設定
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
