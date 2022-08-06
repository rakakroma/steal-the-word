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
import { renderRuby } from './utils/renderRuby';



//第二個重要功能：已上色的ruby要能夠很快的儲存新例句／片語

console.log('Content script works!');

// let displayWords = [];

const app = document.createElement('div')
const body = document.body
const divInApp = document.createElement('div');
divInApp.id = 'hooliruby-div-in-app'

const floatingTool = document.createElement('div')
floatingTool.id = 'hooliruby-floating-tool'
const buttonOfFloatingTool = document.createElement('button')

buttonOfFloatingTool.textContent = 'ルビ振る'
buttonOfFloatingTool.id = 'hooliruby-floating-tool-button'

// const reRenderButton = document.createElement('button')
// reRenderButton.id = 'hooliruby-reRenderButton'
// reRenderButton.textContent = 're-render'

// const infoDiv = document.createElement('div')
// infoDiv.id = 'hooriruby-info-div'

// const countList = document.createElement('ol')
// const countListItem = document.createElement('li')

// infoDiv.appendChild(countList)




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
        shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
            ele.classList.add('hide-create')
        })
    })
    shadowApp.appendChild(style)
    shadowApp.appendChild(createForm)
    shadowApp.appendChild(languageDiv)
    shadowApp.appendChild(divInApp)

    // body.appendChild(infoDiv)


    buttonOfFloatingTool.addEventListener('click', (e) => {
        if (document.getSelection().toString().trim()) {
            shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
                ele.classList.remove('hide-create')
            })
            setTimeout(() => {
                pronounceInput.focus()
            }, 200)
            let selectedString = document.getSelection().toString()
            vocabularyInput.value = selectedString
            console.log('shorter', document.getSelection().anchorNode.textContent.length);
            console.log("longer", document.getSelection().anchorNode.parentElement.textContent.length);
            const biggerParagraph = document.getSelection().anchorNode.parentElement.textContent

            var supp = cldrSegmentation.suppressions.en;
            const splitted = cldrSegmentation.sentenceSplit(biggerParagraph, supp)
            console.log(splitted);
            splitted.forEach((sentence, i) => console.log(i, sentence.length))

            const gotSentence = splitted.filter(sentence => sentence.includes(selectedString))

            contextDiv.textContent = gotSentence[0]
            // console.log(gotSentence[0]);
            document.getSelection().removeAllRanges()
            // divInApp.textContent = ""
        } else {
            console.log('沒東西')
        }
    })

    // reRenderButton.addEventListener('click', () => {
    //     renderRuby(document, myList, displayWords)
    // })

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
        // myList.map(wordObj => {
        //     const li = document.createElement('li')
        //     li.textContent = wordObj.word
        //     // app.appendChild(li)
        //     divInApp.appendChild(li)
        // })
        renderRuby(document, myList)


        setTimeout(() => {
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
            // floatingTool.appendChild(reRenderButton)
        }
    })

}


// init()

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        // console.log(mutation);
        renderRuby(document, myList)
    })
})
let myList = [];
let whiteList = []

const startFunction = () => {
    chrome.storage.local.get(["myWordList", "whiteDomainList", 'onOff'], function (obj) {
        // turnOn = obj.onOff || true
        console.log(obj.onOff);
        if (obj.onOff === false) { return }
        else {
            init()
            if (obj.myWordList && obj.myWordList.length > 0) {
                myList = obj.myWordList
                renderRuby(document, myList)
                whiteList = obj.whiteDomainList || []
                if (Array.isArray(whiteList) && whiteList.includes(window.location.host)) {
                    observer.observe(body, { childList: true, subtree: true, characterData: true })
                }
            }
        }
    })
}

// const displayList = []
startFunction()

// const renderDisplayDiv = () => {
//     displayList.forEach(wordObj => {
//         countListItem.textContent = wordObj.word
//         countList.appendChild(countListItem)
//     })
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log(sender);

    const thisDomain = message.tabInfo.url.split("//")[1].split('/')[0]
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
    } else {
        sendResponse({ content: 'content script 已收到訊息' })
    }
});


