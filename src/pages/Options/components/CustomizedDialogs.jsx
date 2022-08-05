import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import { FormControl, FormControlLabel, FormLabel, FormGroup, FormHelperText, Checkbox, Box, Tab, Tabs, Input, Link, Divider, Switch, InputLabel, Select, MenuItem } from '@mui/material';
import { TabsContext } from '@mui/base';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TextFormatRounded } from '@mui/icons-material';
import { display } from '@mui/system';
import { defaultRubyStyle } from './defaultRuby.style'



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
            bottom: 8,
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

export default function CustomizedDialogs({ handleExport, handleImport }) {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [setting, setSetting] = React.useState({
    buttonAfterSelection: true,
    contextMenuButton: true,
    showButtonUsingHotKey: false,
    taiwanese: true,
    hakkaSixian: true,
    hakkaHailu: false,
    hakkaDapu: false,
    hakkaRaoping: false
  });


  const [customRubyStyle, setCustomRubyStyle] = React.useState(defaultRubyStyle)


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
        [event.target.name]: value || event.target.value
      },
      rt: {
        ...customRubyStyle.rt
      }
    })
  }




  const handleChangeRtStyle = (event, value) => {
    setCustomRubyStyle({
      ruby: {
        ...customRubyStyle.ruby
      },
      rt: {
        ...customRubyStyle.rt,
        [event.target.name]: value || event.target.value
      }
    })
  }
  const {
    buttonAfterSelection,
    contextMenuButton,
    showButtonUsingHotKey,
    taiwanese,
    hakkaSixian,
    hakkaHailu,
    hakkaDapu,
    hakkaRaoping } = setting;

  const [currentTab, setCurrentTab] = React.useState("2");
  const handleChangeTab = (e, newTab) => {
    setCurrentTab(newTab)
  }




  return (
    <div >
      <Button sx={{ color: 'whitesmoke', borderColor: 'whitesmoke' }} variant="outlined" onClick={handleClickOpen}>
        <SettingsIcon />    </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogContent >

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={currentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                  <Tab label="設定" icon={<SettingsIcon />} iconPosition='end' value='1' />
                  <Tab label="樣式" icon={<TextFormatRounded />} iconPosition='end' value='2' />
                  <Tab label="匯入／匯出" icon={<ImportExportIcon />} iconPosition='end' value='3' />
                </TabList>
              </Box>
              <TabPanel value="1">
                {/* <Typography variant='h5'>使用方式</Typography> */}
                <FormControl sx={{ m: 3 }} component="fieldset" variant='standard'>
                  <FormLabel component='legend'>使用方式</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={buttonAfterSelection} onChange={handleChange} name='buttonAfterSelection' />
                      }
                      label='選取文字後自動出現按鈕'
                    />
                    <FormHelperText>⚠️不少網站（如Yahoo!ニュース）及Edge瀏覽器在選取文字後會出現功能鍵（Edge可從設定中關閉），
                      與本功能觸發機制相似，若一併使用會導致畫面複雜，
                      較容易誤觸及需按兩次（Edge）才能生效。</FormHelperText>

                    <FormControlLabel
                      control={
                        <Checkbox checked={contextMenuButton} onChange={handleChange} name='contextMenuButton' />
                      }
                      label='選取文字後右鍵選單傳入編輯框'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={showButtonUsingHotKey} onChange={handleChange} name='showButtonUsingHotKey' />
                      }
                      label='選取後使用熱鍵(hotkey)傳入編輯框'
                    />
                  </FormGroup>
                </FormControl>
                <FormControl sx={{ m: 3 }} component="fieldset" variant='standard'>
                  <FormLabel component='legend'>讀音快速查詢鍵</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox checked={taiwanese} onChange={handleChange} name='taiwanese' />
                      }
                      label='台語'
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox checked={hakkaSixian} onChange={handleChange} name='hakkaSixian' />
                      }
                      label='四縣'
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox checked={hakkaHailu} onChange={handleChange} name='hakkaHailu' />
                      }
                      label='海陸'
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox checked={hakkaDapu} onChange={handleChange} name='hakkaDapu' />
                      }
                      label='大埔'
                    />
                    <FormControlLabel
                      labelPlacement="bottom"
                      control={
                        <Checkbox checked={hakkaRaoping} onChange={handleChange} name='hakkaRaoping' />
                      }
                      label='饒平'
                    />
                  </FormGroup>
                </FormControl>

              </TabPanel>
              <TabPanel value="2">
                {/* <HexColorPicker color={customRubyStyle.ruby.color} onChange={handleChangeRubyStyle} name='color' /> */}

                <FormControlLabel control={
                  <Switch
                    disabled={customRubyStyle.rt.display === 'none' ? true : false}
                    size="small"
                    checked={customRubyStyle.ruby.rubyPosition === 'under'}
                    onChange={(e) => {
                      customRubyStyle.ruby.rubyPosition === 'under' ?
                        handleChangeRubyStyle(e, "over") :
                        handleChangeRubyStyle(e, "under")
                    }} />} label="小字位置" name='rubyPosition' />

                <FormControlLabel control={
                  <Switch
                    size="small"
                    checked={customRubyStyle.rt.display === 'none'}
                    onChange={(e) => {
                      customRubyStyle.rt.display === 'none' ?
                        handleChangeRtStyle(e, "block") :
                        handleChangeRtStyle(e, "none")
                    }} />} label="隱藏小字" name='display' />
                <Box sx={{ display: 'flex' }}>
                  <Box>
                    <Typography variant='h6'>設定rt樣式</Typography>
                    <FormGroup row>
                      <FormControlLabel
                        labelPlacement="left"
                        control={
                          <Input
                            disabled={customRubyStyle.rt.display === 'none' ? true : false}
                            sx={{ width: '15px', height: '15px' }}
                            type='color'
                            value={customRubyStyle.rt.backgroundColor}
                            onChange={(e) => handleChangeRtStyle(e)}
                            name='backgroundColor'
                          />

                        }
                        label='背景'
                      />
                      <FormControlLabel
                        labelPlacement="left"
                        control={
                          <Input
                            disabled={customRubyStyle.rt.display === 'none' ? true : false}
                            sx={{ width: '15px', height: '15px' }}
                            type='color'
                            value={customRubyStyle.rt.color}
                            onChange={(e) => handleChangeRtStyle(e)}
                            name='color'
                          />

                        }
                        label='顏色'
                      />


                      {/* <InputLabel >underline</InputLabel> */}
                      <Select
                        disabled={customRubyStyle.rt.display === 'none' ? true : false}
                        size='small'
                        // labelId="demo-simple-select-label"
                        // id="demo-simple-select"
                        value={customRubyStyle.rt.textDecoration}
                        // label="Age"
                        onChange={e => {
                          handleChangeRtStyle(e)
                        }}
                        name='textDecoration'
                      >
                        <MenuItem value="">none</MenuItem>
                        <MenuItem value="underline">underline</MenuItem>
                        <MenuItem value="underline dotted">dotted</MenuItem>
                        <MenuItem value="underline wavy">wavy</MenuItem>
                      </Select>

                    </FormGroup>

                    <Typography variant='h6'>設定ruby樣式</Typography>
                    <FormGroup row>
                      <FormControlLabel
                        labelPlacement="left"
                        control={
                          <Input
                            sx={{ width: '15px', height: '15px' }}
                            type='color'
                            value={customRubyStyle.ruby.color}
                            onChange={(e) => handleChangeRubyStyle(e)}
                            name='color'
                          />

                        }
                        label='字體顏色'
                      />
                      <FormControlLabel
                        labelPlacement="left"
                        control={
                          <Input
                            sx={{ width: '15px', height: '15px' }}
                            type='color'
                            value={customRubyStyle.ruby.backgroundColor}
                            onChange={(e) => handleChangeRubyStyle(e)}
                            name='backgroundColor'
                          />

                        }
                        label='背景顏色'
                      />
                      {/* <InputLabel id="demo-simple-select-label">underline</InputLabel> */}
                      <Select
                        size='small'
                        // labelId="demo-simple-select-label"
                        // id="demo-simple-select"
                        value={customRubyStyle.ruby.textDecoration}
                        // label="Age"
                        onChange={e => {
                          handleChangeRubyStyle(e)
                        }}
                        name='textDecoration'
                      >
                        <MenuItem value="">none</MenuItem>
                        <MenuItem value="underline">underline</MenuItem>
                        <MenuItem value="underline dotted">dotted</MenuItem>
                        <MenuItem value="underline wavy">wavy</MenuItem>
                      </Select>
                    </FormGroup>

                  </Box>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: '40px'
                  }}>
                    <Typography variant='h3'><ruby style={customRubyStyle.ruby}>你好<rt style={customRubyStyle.rt}>lí hó</rt></ruby></Typography>
                  </Box>
                </Box>
                <Divider sx={{ m: 3 }}></Divider>
                <Typography variant='body1' gutterBottom>
                  食著藥，青草一葉；食毋著藥，
                  <ruby style={customRubyStyle.ruby}>人參<rt style={customRubyStyle.rt}>jîn-sim</rt></ruby>一石。
                  Tsia̍h tio̍h io̍h, tshinn-tsháu tsi̍t hio̍h; tsia̍h m̄-tio̍h io̍h,
                  <ruby style={customRubyStyle.ruby}>jîn-sim<rt style={customRubyStyle.rt}>人參</rt></ruby> tsi̍t tsio̍h.

                  鼻は<ruby style={customRubyStyle.ruby}>人参<rt style={customRubyStyle.rt}>にんじん</rt></ruby>のようだ。
                  <ruby style={customRubyStyle.ruby}>인삼<rt style={customRubyStyle.rt}>人参</rt></ruby>을 밭에서 대량으로 수확했다.
                  • The company does not sell its products outside its own stores and buys
                  <ruby style={customRubyStyle.ruby}>ginseng<rt style={customRubyStyle.rt}>root been used in traditional medicine</rt></ruby>
                  from wholesalers, Miller said.</Typography>

                {/* <Typography variant='h6' gutterBottom>ruby背景顏色</Typography> */}
              </TabPanel>

              <TabPanel value="3">

                {/* <h4>匯入與匯出</h4> */}
                <FormControl sx={{ m: 3 }} component="fieldset" variant='standard'>
                  <FormLabel component='legend'>匯入</FormLabel>

                  <FormControlLabel
                    control={
                      <Input type='file' inputProps={{ accept: '.json' }} />
                    }
                  // label='匯入json格式資料'
                  />
                  <FormHelperText>⚠️注意：資料格式為json，匯入後將取代原本清單</FormHelperText>
                </FormControl>

                <Link href={handleExport().link} download={handleExport().fileName}>下載單字清單</Link>

                {/* <form id='upload' onSubmit={handleImport}>
                  <label htmlFor="file">上傳資料（json）</label>
                  <input type='file' id='file' accept='.json' />
                  <button>匯入</button>
                </form> */}
                {/* <div>注意：匯入資料將取代原本清單</div> */}
                {/* <a
                href={handleExport('href')} 
                download={handleExport('download')}
                >下載單字清單</a> */}

              </TabPanel>

            </TabContext>
          </Box>

          {/* 
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            設定
          </BootstrapDialogTitle> */}


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
