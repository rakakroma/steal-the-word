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


const app = document.createElement('div')
const body = document.body
const divInApp = document.createElement('div');
divInApp.id = 'hooliruby-div-in-app'

const floatingTool = document.createElement('div')
floatingTool.id = 'hooliruby-floating-tool'
// floatingTool.textContent = '有東西'
const buttonOfFloatingTool = document.createElement('button')

buttonOfFloatingTool.textContent = 'ルビ振る'
buttonOfFloatingTool.id = 'hooliruby-floating-tool-button'

const reRenderButton = document.createElement('button')
reRenderButton.id = 'hooliruby-reRenderButton'
reRenderButton.textContent = 're-render'

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

    buttonOfFloatingTool.addEventListener('click', (e) => {
        if (document.getSelection().toString().trim()) {
            shadowApp.querySelectorAll('.hooliruby-create').forEach(ele => {
                ele.classList.remove('hide-create')
            })
            setTimeout(() => {
                pronounceInput.focus()
            }, 500)
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

            // contextInput.value = gotSentence[0]
            contextDiv.textContent = gotSentence[0]
            // console.log(gotSentence[0]);
            document.getSelection().removeAllRanges()
            console.log('傳了')
            divInApp.textContent = ""
        } else {
            console.log('沒東西')
        }
    })

    reRenderButton.addEventListener('click', () => {
        renderRuby(document, myList)
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
        }, 500)
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
            floatingTool.appendChild(reRenderButton)
        }
    })

}


init()

const observer = new MutationObserver((mutations) => {
    // console.log(mutations);
})

let myList = [];
let displayWords = [];
chrome.storage.local.get("myWordList", function (obj) {
    if (obj.myWordList && obj.myWordList.length > 0) {
        myList = obj.myWordList
        renderRuby(document, myList)
        observer.observe(document, body, { childList: true, subtree: true, characterData: true })
    }
})
