# Steal The Word 🥷

### A Chrome Extension for highlighting, collecting, annotating text in web pages.

### Go to [Chrome Web Store](https://chrome.google.com/webstore/detail/steal-the-word/lolkalfaocfklgolbfblhdblhdppoaoa) for Installation & Introduction

---

## Change Log 🪵🪵🪵

### v0.0.20 🐸 (2023-05-11)

- Fixed: More Performant 🆒 ,the work of searching and replacing text should not block the main thread right now (In Most Cases, Except certain case like txt file)
- Fixed: Time Mode Virtual List, star shows number zero
- Fixed: Stem not been edited if no new stem (content script)
- Feature: Can show annotation in Collection
- Feature: Show Colored Stars
- Feature: Navigate to Site Collection by clicking site icon
- Feature: Google Search button in Collection Word Info
- Feature: Support Youtube transcript
- Feature: Support Local File and html file from pdf2htmlEX (partly)
- Feature: Show '0' in Badge Text at Start
- Dev: Add Some Unit Test
- Dev: Update to React 18
- And Others....

### v0.0.14 🛣️ (2023-04-19)

- Fixed: Delete Checkbox Bug (Content Script)
- Fixed: Translation
- Fixed: preferences overwritten when onInstalled
- Fixed: NavLink in Settings
- Changed: Annotation Input is now using hooli-textarea

### v0.0.13 🐲 (2023-04-12)

- Fixed: translation
- Fixed: the blank Link of Tutorial
- Fixed: weird default icon of page favicon
- Added: Add Error Page
- Changed: option's breakpoint of layout
- Changed: redesign search button in Options
- Changed: Router Support of tabs in Settings
- Changed: demoData.json is stored in this github repo, can be fetched by internet, not be stored inside the extension itself
- Changed: Stop open Options Page automatically

### v0.0.12 🦑 (2023-03-30)

- Fixed: Check 'contenteditable' attribute of node's ascendant, reduce bugs of the replacement of string inside Javascript text editor.
- Fixed: lack of white space of anchor text inside Settings -> API.

---

## Tools 🧰 / Packages 📦

### Boilerplate:

[Chrome Extension (MV3), React & Webpack Boilerplate by lxieyang ](https://github.com/lxieyang/chrome-extension-boilerplate-react)

### Whole app:

1. Dexie.js for IndexedDB
2. dayjs

### Content Script:

1. lit web component
2. lit-translate
3. redux toolkit
4. interactjs
5. floating-ui
6. [get-selection-more](https://github.com/crimx/get-selection-more)
7. API: [台客語萌典](https://github.com/g0v/moedict-webkit)、[goo 辞書 ひらがな化 API](https://labs.goo.ne.jp/api/jp/hiragana-translation/)、[dictionaryapi](https://dictionaryapi.dev/)

### Options:

1. React
2. Material UI
3. react-router-dom
4. [kbar](https://github.com/timc1/kbar)
5. [nivo](https://nivo.rocks/)
6. react-virtuoso
7. react-select
8. react-hook-form
9. react-i18next

---

⚠️ Warning: Bugs in some website / web text editor (e.g. CodeSandbox, Codepen), be sure to disable it in those sites.

---

License: MIT

---
