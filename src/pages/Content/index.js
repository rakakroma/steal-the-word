// import { nanoid } from 'nanoid'
// import {
//     languageDiv,
//     createForm,
//     vocabularyInput,
//     pronounceInput,
//     meaningInput,
//     contextDiv,
//     searchHakkaButton,
//     searchTaiwaneseButton,
//     submitButton,
//     sizeControlButton,
//     vocabularyInputWrapper
// } from './components/createForm'
// import { shadowAppTopStyle } from './shadowApp.style';
import { renderRuby } from './utils/renderRuby';
import { infoSection, showWordList, wordInPageList } from './components/infoSection'
// import { floatingTool, buttonOfFloatingTool } from './components/floatingTool'
// import { getSelectedSentence } from './utils/getSelectedSentence';
// import { getSentenceFromSelection } from './utils/get-selection-more'
import './components/customElements/HolliText';
import './components/customElements/wordListMinimizedBar'
import { setWordBlockPosition } from './utils/setWordBlockPosition'

//第二個重要功能：已上色的ruby要能夠很快的儲存新例句／片語

console.log('Content script works!');


// const app = document.createElement('div')
const body = document.body
// const divInApp = document.createElement('div');
// divInApp.id = 'hooliruby-div-in-app'

const currentURL = window.location.hash ?
    window.location.href.slice(0, window.location.href.lastIndexOf(window.location.hash)) :
    window.location.href

const init = () => {

    // app.id = "hooliruby-root";
    // app.style.width = '100vw';
    // app.classList.add('hide-hooliruby')
    // body.appendChild(app);
    // console.log('init!')
    // const shadowApp = app.attachShadow({ mode: 'open' })
    // let style = document.createElement('style');

    // style.textContent = shadowAppTopStyle

    // sizeControlButton.addEventListener('click', () => {
    //     app.classList.add('hide-hooliruby')
    //     shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
    //         ele.classList.add('hide-create')
    //     })
    // })
    // shadowApp.appendChild(style)
    // shadowApp.appendChild(createForm)
    // shadowApp.appendChild(languageDiv)
    // shadowApp.appendChild(divInApp)



    // buttonOfFloatingTool.addEventListener('click', (e) => {
    //     if (document.getSelection().toString().trim()) {
    //         app.classList.remove('hide-hooliruby')
    //         shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
    //             ele.classList.remove('hide-create')
    //         })
    //         setTimeout(() => {
    //             pronounceInput.focus()
    //         }, 200)
    //         vocabularyInput.value = document.getSelection().toString()
    //         const selection = document.getSelection()

    //         const clearRubyText = (wordInPageList, sentence) => {
    //             const displayingWordsArray = wordInPageList.map(wordObj => {
    //                 return { combined: wordObj.word + wordObj.alias, cleared: wordObj.word }
    //             })
    //             let result = sentence
    //             displayingWordsArray.forEach(pair => {
    //                 result = result.replace(pair.combined, pair.cleared)
    //             })
    //             return result
    //         }
    //         contextDiv.textContent = clearRubyText(wordInPageList, getSentenceFromSelection(selection))

    //         // contextDiv.textContent = getSelectedSentence(selection)
    //         // console.log([getSelectedSentence(selection),
    //         // getSentenceFromSelection(selection)])
    //         document.getSelection().removeAllRanges()
    //     }
    //     setTimeout(() => {
    //         if (document.querySelector('#hooliruby-floating-tool')) body.removeChild(floatingTool)
    //     })

    // })

    // vocabularyInput.addEventListener('input', (e) => {
    //     const vocabularyInputValue = e.target.value.trim()

    //     if (vocabularyInputValue[vocabularyInputValue.length - 1] === '@') {
    //         connect = true
    //     }
    //     if (connect) {
    //         if (!vocabularyInputValue.includes("@")) {
    //             connect = false
    //             vocabularyInputWrapper.removeChild(shadowApp.querySelector('#hooli-auto-suggestion-div'))
    //             // autoSuggestionList?.textContent = ""
    //         }
    //         if (shadowApp.querySelector('#hooli-auto-suggestion-div')) {
    //             vocabularyInputWrapper.removeChild(shadowApp.querySelector('#hooli-auto-suggestion-div'))
    //         }
    //         const autoSuggestionDiv = document.createElement('div')
    //         autoSuggestionDiv.id = 'hooli-auto-suggestion-div'
    //         const autoSuggestionList = document.createElement('ol')
    //         autoSuggestionList.id = 'hooli-auto-suggestion-list'
    //         autoSuggestionList.textContent = ""
    //         autoSuggestionDiv.appendChild(autoSuggestionList)
    //         const matchingKeyword = vocabularyInputValue.split('@')[1]

    //         if (matchingKeyword.length > 0) {
    //             const matchedArray = myList.filter(wordObj => wordObj.word.startsWith(matchingKeyword))
    //             matchedArray.forEach((wordObj, i) => {
    //                 const autoSuggestionListItem = document.createElement('li')
    //                 autoSuggestionListItem.class = 'hooli-auto-suggestion-item'
    //                 autoSuggestionListItem.textContent = wordObj.word
    //                 autoSuggestionListItem.id = `a-${i}`
    //                 autoSuggestionListItem.tabIndex = 0
    //                 // listItem.addEventListener('focus',(e)=>console.log("focused",e.target.id))

    //                 autoSuggestionListItem.addEventListener('keydown', (e) => {
    //                     e.preventDefault();
    //                     if (e.code === 'Enter') {
    //                         console.log(e.target.textContent)
    //                         const associatedWords = document.createElement('ul')
    //                         associatedWords.id = 'associated-words'
    //                         const associatedWordItem = document.createElement('li')
    //                         associatedWordItem.className = 'associated-word-item'
    //                         associatedWordItem.textContent = e.target.textContent
    //                         associatedWords.appendChild(associatedWordItem)
    //                         autoSuggestionDiv.prepend(associatedWords)
    //                         autoSuggestionList.textContent = ""
    //                         vocabularyInput.value = ""
    //                         setTimeout(() => { vocabularyInput.focus() }, 0)
    //                     }
    //                     if (e.code === 'ArrowDown') {
    //                         if (shadowApp.querySelector(`#a-${+e.target.id.slice(2) + 1}`)) {
    //                             shadowApp.querySelector(`#a-${+e.target.id.slice(2) + 1}`).focus()
    //                         }
    //                     }
    //                     if (e.code === 'ArrowUp') {
    //                         if (e.target.id === 'a-0') {
    //                             vocabularyInput.focus()
    //                         }
    //                         if (shadowApp.querySelector(`#a-${+e.target.id.slice(2) - 1}`)) {
    //                             e.stopPropagation()
    //                             shadowApp.querySelector(`#a-${+e.target.id.slice(2) - 1}`).focus()
    //                         }
    //                     }
    //                 }
    //                 )
    //                 autoSuggestionList.appendChild(autoSuggestionListItem)
    //                 autoSuggestionDiv.appendChild(autoSuggestionList)
    //                 vocabularyInputWrapper.appendChild(autoSuggestionDiv)
    //             })
    //         }


    //         vocabularyInput.addEventListener('keydown', (e) => {
    //             console.log(e.code)
    //             if (e.code === 'ArrowDown') {
    //                 shadowApp.querySelector('#a-0')?.focus()
    //                 // console.log(document.activeElement.localName)
    //             }
    //         })

    //     } else {
    //         //   autoSuggestionList.innerHTML = ""
    //     }
    // })


    // createForm.addEventListener('submit', (e) => {
    //     e.preventDefault()

    //     const theNewWord = {
    //         id: nanoid(),
    //         word: vocabularyInput.value.trim(),
    //         associationWOrdIds: [],
    //         definitionCount: 1,
    //         definitions: [{
    //             aliases: [pronounceInput.value.trim()],
    //             definitionId: '0',
    //             note: '',
    //             pronunciation: '',
    //             tags: []
    //         }],
    //         lang: [],
    //         matchRule: '',
    //         pronunciation: '',
    //         stem: '',
    //         variants: []
    //     }

    //     const theNewContext = {
    //         context: contextDiv.textContent.trim(),
    //         date: Date.now(),
    //         definitionRef: '0',
    //         note: '',
    //         pageTitle: document.title,
    //         phrase: '',
    //         url: currentURL,
    //         word: theNewWord.word,
    //         wordId: theNewWord.id
    //     }

    //     if (myList.find(wordObj => wordObj.word === theNewWord.word)) {
    //         alert('stop!')
    //         return
    //     }
    //     if (!theNewContext.context) {
    //         alert('stop')
    //         return
    //     }

    //     chrome.runtime.sendMessage({
    //         newWord: theNewWord,
    //         newContext: theNewContext
    //     }, (response) => {

    //         if (response.message) {
    //             console.log(response);
    //             myList.push(theNewWord);
    //             renderRuby(document, myList, { floatingWindow }, true)

    //         }
    //     });


    //     vocabularyInput.value = ''
    //     pronounceInput.value = ''
    //     meaningInput.value = ''
    //     contextDiv.textContent = ""



    //     setTimeout(() => {
    //         app.classList.add('hide-hooliruby')
    //         shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
    //             ele.classList.add('hide-create')
    //         })
    //     }, 20)
    // })


    const addingTool = document.createElement('hooli-adding-tool')

    body.addEventListener('mouseup', (e) => {
        if(e.button === 2) return
        const selection = document.getSelection()
        const selectedText = selection.toString().trim()
        // const clientRect = selection.getRangeAt(0).getBoundingClientRect()
        const elementOnBody = document.querySelector('hooli-adding-tool')

        if (elementOnBody) return
        // setTimeout(() => {
        //     if (!selectedText &&
        //         // document.querySelector('#hooliruby-floating-tool')) body.removeChild(floatingTool)
        //         document.querySelector('hooli-adding-tool'))body.removeChild(addingTool)
        // })

        if (selectedText) {
            if (selection.anchorNode?.children) return
            if (selectedText.length > 60) return
            // addingTool.style.top = (e.pageY + 10) + 'px'
            // addingTool.style.left = (e.pageX - 25) + 'px'
            setWordBlockPosition(window.getSelection().getRangeAt(0), addingTool)

            // floatingTool.style.top = (e.pageY - 10) + 'px'
            // floatingTool.style.left = (e.pageX + 25) + 'px'
            // floatingTool.style.top = window.innerHeight - clientRect.top + 'px'
            // console.log(clientRect)
            // if (document.querySelector('#hooliruby-floating-tool')) {
            //     return
            // }
     
                document.querySelector('hooli-adding-tool')?.remove()
            body.appendChild(addingTool)
            // body.appendChild(floatingTool)
            // floatingTool.appendChild(buttonOfFloatingTool)
            return
        }
    })
}


// throttle
let coldTime = false
let timeout = null
let visible = true

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        visible = true
    } else {
        visible = false
    }
  });

const observer = new MutationObserver((mutations) => {
    console.log(mutations)
    if (visible) {
        if (mutations.length === 1 && mutations[0].type === 'childList') {
            if (mutations[0].addedNodes.length === 0) return
            if (mutations[0].addedNodes[0].tagName?.includes('HOOLI')) return
        }
        setTimeout(() => { renderRuby(document, myList, { floatingWindow }) })
    }
}
)




export let myList = [];
let whiteList = []
export let floatingWindow = false
let connect = false

const startFunction = () => {


//test i18n
chrome.i18n.getAcceptLanguages(result=>console.log('accept lang:',result))
console.log('ui lang:',chrome.i18n.getUILanguage())

//
    chrome.storage.local.get([
        'activate', 'mouseTool', 'floatingWindow'], function (obj) {
            console.log(obj)
            if (obj.activate === false) {
                // console.log('not working here')
                chrome.runtime.sendMessage({ action: 'notWorking' })
                return
            }
            chrome.runtime.sendMessage({ action: 'getStart', url: currentURL }, (res) => {
                console.log(res)
                if (res.activate === false) {
                    chrome.runtime.sendMessage({ action: 'notWorking' })
                    return
                }
                if (obj.floatingWindow) {
                    floatingWindow = true
                    // console.log("I'm here")
                    // window.addEventListener('load', () => {
                    // setTimeout(() => {
                    // showWordList()
                    // })
                    // })
                    const wordListElement=  document.createElement('hooli-floating-word-list')
                    // wordListElement.wordListInThisPage= [...wordInPageList]
                    body.appendChild(wordListElement)
                }
                if (res.wordList.length > 0) {
                    myList = res.wordList
                    let loadEvent = false
                    const startAfterLoaded = () => {
                        console.log('page loaded')
                        loadEvent = true
                        renderRuby(document, myList, { floatingWindow }, true)
                        observer.observe(body, { childList: true, subtree: true, characterData: true })
                        window.removeEventListener('load', startAfterLoaded)
                    }
                    window.addEventListener('load', startAfterLoaded())
                    setTimeout(() => {
                        if (!loadEvent) {
                            renderRuby(document, myList, { floatingWindow }, true)
                            observer.observe(body, { childList: true, subtree: true, characterData: true })

                            window.removeEventListener('load', startAfterLoaded)
                        }
                    }, 2500)
                } else {
                    console.log('nothing');
                }
                init()

            })
        })
}

startFunction()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log(sender);
    let thisDomain;
    if (message.tabInfo) {
        thisDomain = message.tabInfo.url.split("//")[1].split('/')[0]
    }
    if (message.dynamicRendering) {
        whiteList.push(thisDomain)
        console.log(whiteList)
        chrome.storage.local.set({ "whiteDomainList": whiteList }, () => {
            sendResponse({ content: `已加入white list : ${whiteList}` });
            observer.observe(body, { childList: true, subtree: true, characterData: true })
        })
        return true;
    } else if (message.dynamicRendering === false) {
        whiteList = whiteList.filter(domainName => domainName !== thisDomain)
        console.log(whiteList)
        chrome.storage.local.set({ "whiteDomainList": whiteList }, () => {
            observer.disconnect()
            sendResponse({ content: `已移出white list : ${whiteList}` });
        })
        return true;
    } else if (message.showWordList === true) {
        floatingWindow = true
        chrome.storage.local.set({ "floatingWindow": true }, () => {
            if (body.querySelector('#hooriruby-info-div')) {
                body.querySelector('#hooriruby-info-div').classList.remove('hide')
            }
            renderRuby(document, myList, { floatingWindow })
            showWordList()
            console.log('open')
            sendResponse({ content: "已顯示wordList" })
        })
        return true;
    } else if (message.showWordList === false) {
        // floatingWindow = false
        chrome.storage.local.set({ 'floatingWindow': false }, () => {
            floatingWindow = false
            if (body.querySelector('#hooriruby-info-div')) {
                // body.removeChild(infoSection)
                body.querySelector('#hooriruby-info-div').classList.add('hide')
            }
            renderRuby(document, myList, { floatingWindow })
            console.log('close')
            sendResponse({ content: "已關閉wordList" })
        })
        return true;
    }
    else {
        sendResponse({ content: 'content script 已收到訊息' })
    }
});


