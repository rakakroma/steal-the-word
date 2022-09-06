import { nanoid } from 'nanoid'
import {
    languageDiv,
    createForm,
    vocabularyInput,
    pronounceInput,
    meaningInput,
    contextDiv,
    searchHakkaButton,
    searchTaiwaneseButton,
    submitButton,
    sizeControlButton,
    vocabularyInputWrapper
} from './components/createForm'
import { shadowAppTopStyle } from './shadowApp.style';
import { renderRuby } from './utils/renderRuby';
import { infoSection, showWordList, displayList } from './components/infoSection'
import { floatingTool, buttonOfFloatingTool } from './components/floatingTool'
import { getSelectedSentence } from './utils/getSelectedSentence';
import { getParagraphFromSelection, getSentenceFromSelection } from 'get-selection-more';


//第二個重要功能：已上色的ruby要能夠很快的儲存新例句／片語

console.log('Content script works!');

// let displayWords = [];

const app = document.createElement('div')
const body = document.body
const divInApp = document.createElement('div');
divInApp.id = 'hooliruby-div-in-app'


const init = () => {

    app.id = "hooliruby-root";
    app.style.width = '100vw';
    app.classList.add('hide-hooliruby')
    body.appendChild(app);
    console.log('init!')
    const shadowApp = app.attachShadow({ mode: 'open' })
    let style = document.createElement('style');

    style.textContent = shadowAppTopStyle

    sizeControlButton.addEventListener('click', () => {
        app.classList.add('hide-hooliruby')
        shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
            ele.classList.add('hide-create')
        })
    })
    shadowApp.appendChild(style)
    shadowApp.appendChild(createForm)
    shadowApp.appendChild(languageDiv)
    shadowApp.appendChild(divInApp)



    buttonOfFloatingTool.addEventListener('click', (e) => {
        if (document.getSelection().toString().trim()) {
            app.classList.remove('hide-hooliruby')
            shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
                ele.classList.remove('hide-create')
            })
            setTimeout(() => {
                pronounceInput.focus()
            }, 200)
            vocabularyInput.value = document.getSelection().toString()
            const selection = document.getSelection()

            const clearRubyText = (displayList, sentence) => {
                const displayingWordsArray = displayList.map(wordObj => {
                    return { combined: wordObj.word + wordObj.alias, cleared: wordObj.word }
                })
                let result = sentence
                displayingWordsArray.forEach(pair => {
                    result = result.replace(pair.combined, pair.cleared)
                })
                return result
            }
            contextDiv.textContent = clearRubyText(displayList, getSentenceFromSelection(selection))

            // contextDiv.textContent = getSelectedSentence(selection)
            // console.log([getSelectedSentence(selection),
            // getSentenceFromSelection(selection)])
            document.getSelection().removeAllRanges()
        }
        setTimeout(() => {
            if (document.querySelector('#hooliruby-floating-tool')) body.removeChild(floatingTool)
        }, 1)

    })

    vocabularyInput.addEventListener('input', (e) => {
        const vocabularyInputValue = e.target.value.trim()

        if (vocabularyInputValue[vocabularyInputValue.length - 1] === '@') {
            connect = true
        }
        if (connect) {
            if (!vocabularyInputValue.includes("@")) {
                connect = false
                vocabularyInputWrapper.removeChild(shadowApp.querySelector('#hooli-auto-suggestion-div'))
                // autoSuggestionList?.textContent = ""
            }
            if (shadowApp.querySelector('#hooli-auto-suggestion-div')) {
                vocabularyInputWrapper.removeChild(shadowApp.querySelector('#hooli-auto-suggestion-div'))
            }
            const autoSuggestionDiv = document.createElement('div')
            autoSuggestionDiv.id = 'hooli-auto-suggestion-div'
            const autoSuggestionList = document.createElement('ol')
            autoSuggestionList.id = 'hooli-auto-suggestion-list'
            autoSuggestionList.textContent = ""
            autoSuggestionDiv.appendChild(autoSuggestionList)
            const matchingKeyword = vocabularyInputValue.split('@')[1]

            if (matchingKeyword.length > 0) {
                const matchedArray = myList.filter(wordObj => wordObj.word.startsWith(matchingKeyword))
                matchedArray.forEach((wordObj, i) => {
                    const autoSuggestionListItem = document.createElement('li')
                    autoSuggestionListItem.class = 'hooli-auto-suggestion-item'
                    autoSuggestionListItem.textContent = wordObj.word
                    autoSuggestionListItem.id = `a-${i}`
                    autoSuggestionListItem.tabIndex = 0
                    // listItem.addEventListener('focus',(e)=>console.log("focused",e.target.id))

                    autoSuggestionListItem.addEventListener('keydown', (e) => {
                        e.preventDefault();
                        if (e.code === 'Enter') {
                            console.log(e.target.textContent)
                            const associatedWords = document.createElement('ul')
                            associatedWords.id = 'associated-words'
                            const associatedWordItem = document.createElement('li')
                            associatedWordItem.className = 'associated-word-item'
                            associatedWordItem.textContent = e.target.textContent
                            associatedWords.appendChild(associatedWordItem)
                            autoSuggestionDiv.prepend(associatedWords)
                            autoSuggestionList.textContent = ""
                            vocabularyInput.value = ""
                            setTimeout(() => { vocabularyInput.focus() }, 0)
                        }
                        if (e.code === 'ArrowDown') {
                            if (shadowApp.querySelector(`#a-${+e.target.id.slice(2) + 1}`)) {
                                shadowApp.querySelector(`#a-${+e.target.id.slice(2) + 1}`).focus()
                            }
                        }
                        if (e.code === 'ArrowUp') {
                            if (e.target.id === 'a-0') {
                                vocabularyInput.focus()
                            }
                            if (shadowApp.querySelector(`#a-${+e.target.id.slice(2) - 1}`)) {
                                e.stopPropagation()
                                shadowApp.querySelector(`#a-${+e.target.id.slice(2) - 1}`).focus()
                            }
                        }
                    }
                    )
                    autoSuggestionList.appendChild(autoSuggestionListItem)
                    autoSuggestionDiv.appendChild(autoSuggestionList)
                    vocabularyInputWrapper.appendChild(autoSuggestionDiv)
                })
            }


            vocabularyInput.addEventListener('keydown', (e) => {
                console.log(e.code)
                if (e.code === 'ArrowDown') {
                    shadowApp.querySelector('#a-0')?.focus()
                    // console.log(document.activeElement.localName)
                }
            })

        } else {
            //   autoSuggestionList.innerHTML = ""
        }
    })


    createForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // console.log(e.target)

        const newWord = {
            word: vocabularyInput.value.trim(),
            alias: pronounceInput.value.trim(),
            meaning: meaningInput.value.trim(),
            context: contextDiv.textContent.trim(),
            date: Date.now().toString(),
            id: nanoid(),
            url: window.location.href,
            pageTitle: document.title,
            domain: window.location.host
        }
        console.log(newWord);

        if (myList.find(wordObj => wordObj.word === newWord.word)) {
            alert('')
        }

        myList.push(newWord);

        chrome.storage.local.set({ "myWordList": myList }, function () {
            // console.log(' myList);
        });

        vocabularyInput.value = ''
        pronounceInput.value = ''
        meaningInput.value = ''
        contextDiv.textContent = ""

        renderRuby(document, myList, displayList, { wordListDisplay })


        setTimeout(() => {
            app.classList.add('hide-hooliruby')
            shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
                ele.classList.add('hide-create')
            })
        }, 20)
    })



    body.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            if (!document.getSelection().toString().trim() &&
                document.querySelector('#hooliruby-floating-tool')) body.removeChild(floatingTool)
        }, 10)

        if (document.getSelection().toString().trim()) {
            if (document.getSelection().anchorNode?.children) return
            floatingTool.style.top = (e.pageY - 10) + 'px'
            floatingTool.style.left = (e.pageX + 25) + 'px'
            if (document.querySelector('#hooliruby-floating-tool')) {
                return
            }
            body.appendChild(floatingTool)
            floatingTool.appendChild(buttonOfFloatingTool)
            return
        }
    })
}


// throttle
let coldTime = false
let timeout = null
const observer = new MutationObserver((mutations) => {
    if (!coldTime) {
        clearTimeout(timeout)
        coldTime = true
        renderRuby(document, myList, displayList, { wordListDisplay })
        timeout = setTimeout(() => {
            coldTime = false
        }, 500)
    }
}
)

let myList = [];
let whiteList = []
let wordListDisplay = false
let connect = false


const startFunction = () => {
    chrome.storage.local.get(["myWordList", "whiteDomainList", 'onOff', 'wordListDisplay'], function (obj) {
        // turnOn = obj.onOff || true
        console.log(obj.onOff);
        if (obj.onOff === false) { return }
        else {
            init()
            if (obj.myWordList && obj.myWordList.length > 0) {
                myList = obj.myWordList
                if (obj.wordListDisplay === true) {
                    wordListDisplay = true
                    // window.addEventListener('load', () => {
                    setTimeout(() => {
                        showWordList()
                    }, 500)
                    // })
                }
                renderRuby(document, myList, displayList, { wordListDisplay })
                whiteList = obj.whiteDomainList || []
                if (Array.isArray(whiteList) && whiteList.includes(window.location.host)) {
                    observer.observe(body, { childList: true, subtree: true, characterData: true })
                }
            }
        }
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
        wordListDisplay = true
        chrome.storage.local.set({ "wordListDisplay": true }, () => {
            if (body.querySelector('#hooriruby-info-div')) {
                body.querySelector('#hooriruby-info-div').classList.remove('hide')
            }
            renderRuby(document, myList, displayList, { wordListDisplay })
            showWordList()
            console.log('open')
            sendResponse({ content: "已顯示wordList" })
        })
        return true;
    } else if (message.showWordList === false) {
        // wordListDisplay = false
        chrome.storage.local.set({ 'wordListDisplay': false }, () => {
            wordListDisplay = false
            if (body.querySelector('#hooriruby-info-div')) {
                // body.removeChild(infoSection)
                body.querySelector('#hooriruby-info-div').classList.add('hide')
            }
            renderRuby(document, myList, displayList, { wordListDisplay })
            console.log('close')
            sendResponse({ content: "已關閉wordList" })
        })
        return true;
    }
    else {
        sendResponse({ content: 'content script 已收到訊息' })
    }
});


