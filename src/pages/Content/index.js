import * as cldrSegmentation from 'cldr-segmentation'
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
    sizeControlButton
} from './components/createForm'
import { shadowAppTopStyle } from './shadowApp.style';
import { joinTextAndRubyParagraph } from './utils/joinTextAndRubyParagraph';
import { renderRuby } from './utils/renderRuby';
import {infoSection, showWordList, displayList} from './components/infoSection'
import {floatingTool, buttonOfFloatingTool} from './components/floatingTool'

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
            let selectedString = document.getSelection().toString()
            vocabularyInput.value = selectedString
            const currentNode = document.getSelection().anchorNode
            // console.log('shorter', currentNode.textContent);
            const shorterParagraph = currentNode.textContent.trim()
            // console.log("longer", currentNode.parentElement.textContent.length);
            const biggerParagraph = currentNode.parentElement.textContent.trim()

            const supp = cldrSegmentation.suppressions.en;
            const getChosenSentence = (paragraph, option, containString) => {
                const splittedParagraph = cldrSegmentation.sentenceSplit(paragraph, option)
                console.log(splittedParagraph)
                const gotSentenceByParagraph = splittedParagraph.filter(sentence => sentence.includes(paragraph))
                const gotSentenceByString = splittedParagraph.filter(sentence => sentence.includes(containString))
                return gotSentenceByParagraph[0] || gotSentenceByString[0]
            }

            if (shorterParagraph.split(" ").length > 150) {
                contextDiv.textContent = getChosenSentence(shorterParagraph, supp, selectedString)
            } else if (shorterParagraph.split(" ").length < 3 &&
                shorterParagraph.length > 500) {
                contextDiv.textContent = getChosenSentence(shorterParagraph, supp, selectedString)
            } else if (biggerParagraph.length < 5000) {
                contextDiv.textContent = getChosenSentence(biggerParagraph, supp, selectedString)
            } else if (currentNode.textContent.length < 5000) {
                const currentParagraph = joinTextAndRubyParagraph(currentNode)
                contextDiv.textContent = getChosenSentence(currentParagraph, supp, selectedString)
            }
            document.getSelection().removeAllRanges()
            // divInApp.textContent = ""
        } else {
            console.log('沒東西')
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

        renderRuby(document, myList, displayList,wordListDisplay)


        setTimeout(() => {
            app.classList.add('hide-hooliruby')
            shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
                ele.classList.add('hide-create')
            })
        }, 20)
    })



    body.addEventListener('mouseup', (e) => {
        if (document.querySelector('#hooliruby-floating-tool')) {
            setTimeout(() => {
                body.removeChild(floatingTool)
            }, 10)
        } else if (document.getSelection().toString().trim()) {
            floatingTool.style.top = (e.pageY - 10) + 'px'
            floatingTool.style.left = (e.pageX + 25) + 'px'
            body.appendChild(floatingTool)
            floatingTool.appendChild(buttonOfFloatingTool)
        }
    })

}


// init()

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        // console.log(mutation);
        renderRuby(document, myList, displayList,wordListDisplay)
    })
})
let myList = [];
let whiteList = []
let wordListDisplay = false

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
                    wordListDisplay=true
                    // window.addEventListener('load', () => {
                    setTimeout(() => {
                        showWordList()
                    }, 500)
                    // })
                }
                renderRuby(document, myList, displayList,wordListDisplay)
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
            if( body.querySelector('#hooriruby-info-div')){
                body.querySelector('#hooriruby-info-div').classList.remove('hide')
            }
            renderRuby(document, myList, displayList,wordListDisplay)
            showWordList()
            console.log('open')
            sendResponse({ content: "已顯示wordList" })
        })
        return true;
    } else if (message.showWordList === false) {
        // wordListDisplay = false
        chrome.storage.local.set({ 'wordListDisplay': false }, () => {
            wordListDisplay = false
            if(body.querySelector('#hooriruby-info-div')){
            // body.removeChild(infoSection)
            body.querySelector('#hooriruby-info-div').classList.add('hide')
            }
            renderRuby(document, myList, displayList,wordListDisplay)
            console.log('close')
            sendResponse({ content: "已關閉wordList" })
        })
        return true;
    }
    else {
        sendResponse({ content: 'content script 已收到訊息' })
    }
});


