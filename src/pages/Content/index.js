import * as cldrSegmentation from 'cldr-segmentation'
import { nanoid } from 'nanoid'
import DOMPurify from 'dompurify';


//第二個重要功能：已上色的ruby要能夠很快的儲存新例句／片語

console.log('Content script works!');


const app = document.createElement('div')
const body = document.body
const divInApp = document.createElement('div');
divInApp.id = 'hooriruby-div-in-app'

const sizeControlButton = document.createElement('button')
sizeControlButton.id = 'hooriruby-size-control-btn'
sizeControlButton.textContent = '🔶'
sizeControlButton.classList.add('horriruby-create', 'hide-create')


const floatingTool = document.createElement('div')
floatingTool.id = 'hooriruby-floating-tool'
// floatingTool.textContent = '有東西'
const buttonOfFloatingTool = document.createElement('button')

buttonOfFloatingTool.textContent = 'ルビ振る'
buttonOfFloatingTool.id = 'hooriruby-floating-tool-button'

// buttonOfFloatingTool.addEventListener('click', (e) => {
//     if (document.getSelection().toString()) {
//         shadowApp.querySelectorAll('.horriruby-create').forEach(ele=>{
//             ele.classList.remove('hide-create')
//         })
//         let selectedString = document.getSelection().toString()
//         vocabularyInput.value = selectedString
//         console.log('shorter', document.getSelection().anchorNode.textContent.length);
//         console.log("longer", document.getSelection().anchorNode.parentElement.textContent.length);
//         const biggerParagraph = document.getSelection().anchorNode.parentElement.textContent

//         var supp = cldrSegmentation.suppressions.en;
//         const splitted = cldrSegmentation.sentenceSplit(biggerParagraph, supp)
//         console.log(splitted);
//         splitted.forEach((sentence, i) => console.log(i, sentence.length))

//         const gotSentence = splitted.filter(sentence => sentence.includes(selectedString))

//         // contextInput.value = gotSentence[0]
//         contextDiv.textContent = gotSentence[0]
//         // console.log(gotSentence[0]);
//         document.getSelection().removeAllRanges()
//         console.log('傳了')
//         divInApp.textContent = ""


//     } else {
//         console.log('沒東西')
//     }
// })


const createForm = document.createElement('form')
createForm.id = 'hooriruby-createform'
createForm.classList.add('horriruby-create', 'hide-create')
const vocabularyInput = document.createElement('input')
vocabularyInput.id = 'hooriruby-vocabulary-input'
vocabularyInput.classList.add('horriruby-create', 'hide-create')
vocabularyInput.name = 'vocabulary'
vocabularyInput.placeholder = '單字／単語／單詞／vocabulary'
const pronounceInput = document.createElement('input')
pronounceInput.id = 'hooriruby-pronounce-input'
pronounceInput.classList.add('horriruby-create', 'hide-create')
pronounceInput.name = 'pronounce'
pronounceInput.placeholder = '拼音／注音／振り仮名／prnounciation'
const meaningInput = document.createElement('input')
meaningInput.id = 'hooriruby-meaning-input'
meaningInput.classList.add('horriruby-create', 'hide-create')
meaningInput.name = 'meaning'
meaningInput.placeholder = '詞義／meaning／意味'
const contextDiv = document.createElement('div')
contextDiv.classList.add('horriruby-create', 'hide-create')
contextDiv.contentEditable = 'true'
contextDiv.id = 'hooriruby-context-div'
const submitButton = document.createElement('button')
submitButton.classList.add('horriruby-create', 'hide-create')
submitButton.type = 'submit'
submitButton.textContent = '送'



const searchTaiwaneseButton = document.createElement('button')
searchTaiwaneseButton.id = 'hooriruby-taiwanese-search-button'
searchTaiwaneseButton.textContent = '台'
searchTaiwaneseButton.classList.add('horriruby-create', 'hide-create')

const searchHakkaButton = document.createElement('button')
searchHakkaButton.id = 'hooriruby-hakka-search-button'
searchHakkaButton.textContent = '客'
searchHakkaButton.classList.add('horriruby-create', 'hide-create')


// const moedictTaiwaneseAPI = (word) => {
//     return `https://www.moedict.tw/t/${word}.json`
// }

//moedict API:
//Taiwanese: t
// Hakka: h
//traditional Chinese: a

const moedictAPI = (word, lang) => {
    return `https://www.moedict.tw/${lang}/${word}.json`
}
searchTaiwaneseButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (vocabularyInput.value) {
        fetch(moedictAPI(vocabularyInput.value, 't'))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                pronounceInput.value = data.h[0].T
            })
            .catch(err => console.error(err));

    } else {
        console.log('請輸入詞彙');
    }
})

searchHakkaButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (vocabularyInput.value) {
        fetch(moedictAPI(vocabularyInput.value, 'h'))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                pronounceInput.value = data.h[0].p.split(" ")[0].slice(2)
            })
            .catch(err => console.error(err));

    } else {
        console.log('請輸入詞彙');
    }
})
createForm.appendChild(sizeControlButton)
createForm.appendChild(vocabularyInput)
createForm.appendChild(pronounceInput)
createForm.appendChild(meaningInput)
// createForm.appendChild(contextInput)
createForm.appendChild(contextDiv)
// createForm.appendChild(searchTaiwaneseButton)
createForm.appendChild(submitButton)

// app.appendChild(createForm)
// app.appendChild(divInApp)

const languageDiv = document.createElement('div')
languageDiv.id = 'hoolirubi-language-div'
languageDiv.appendChild(searchHakkaButton)
languageDiv.appendChild(searchTaiwaneseButton)


const init = () => {

    app.id = "hooriruby-root";
    app.style.width = '100vw';
    app.classList.add('hide-hooriruby')
    body.appendChild(app);
    console.log('init!')
    const shadowApp = app.attachShadow({ mode: 'open' })
    let style = document.createElement('style');

    style.textContent = `
#floating-div {
    color: black;
    background-color: whitesmoke;
    position: fixed;
    width: 20vw;
    height: 100vh;
  }
  
  .ejrti3 {
    background-color: cadetblue;
  }
  
  #hooriruby-floating-tool {
    position: absolute;
    width: 50px;
    height: 40px;
    background-color: orange;
    color: aliceblue;
    z-index: 2147483649;
  }
  
  
  #hooriruby-context-div {
    border: 1px black solid;
    display: inline-block;
  }
  
  div.horriruby-create,
  input.horriruby-create {
    background-color: rgb(55, 55, 55);
    min-width: 162px;
    height: auto;
    border: 1px black solid;
    display: inline-block;
    font-size: 15px;
    padding: 2px;
    color:white;
  }
  
  #horriruby-createform {
    height: 4vh;
  }
  
  
  button.horriruby-create {
    border: 1px solid white;
    width: 30px;
    margin-left: 8px;
    color: white;
    height: auto;
    background-color: rgb(98,98,98)
  }

  .horriruby-create.hide-create{
    display: none;
  }
  
      `

    sizeControlButton.addEventListener('click', () => {
        // if (size === 'mini') {
        //     app.classList.add('maximize')
        //     app.classList.remove('minimize')
        //     size = 'medium'
        // } else {
        //     size = 'mini'
        //     app.classList.add('minimize')
        //     app.classList.remove('maximize')

        // }
        shadowApp.querySelectorAll('.horriruby-create').forEach(ele => {
            ele.classList.add('hide-create')
        })
    })
    shadowApp.appendChild(style)
    shadowApp.appendChild(createForm)
    shadowApp.appendChild(languageDiv)
    shadowApp.appendChild(divInApp)

    buttonOfFloatingTool.addEventListener('click', (e) => {
        if (document.getSelection().toString().trim()) {
            shadowApp.querySelectorAll('.horriruby-create').forEach(ele => {
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

    createForm.addEventListener('submit', (e) => {
        e.preventDefault()
        // console.log(e.target)

        const newWord = {
            word: vocabularyInput.value,
            alias: pronounceInput.value,
            meaning: meaningInput.value,
            context: contextDiv.textContent.trim(),
            date: Date.now().toString(),
            id: nanoid(),
            url: window.location.href,
            pageTitle: document.title,
            domain: window.location.host
        }
        console.log(newWord);
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
        renderRuby()
        setTimeout(() => {
            shadowApp.querySelectorAll('.horriruby-create').forEach(ele => {
                ele.classList.add('hide-create')
            })
        }, 500)
    })


    body.addEventListener('mouseup', (e) => {
        if (document.querySelector('#hooriruby-floating-tool')) {
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


init()

const renderRuby = () => {

    const nodeIterator = document.createNodeIterator(body, NodeFilter.SHOW_TEXT, myGoodFilter)

    // mygoodfilter: 抄 
    // https://github.com/XQDD/highlight_new_words/blob/12be7a1d79ad209ffffcbfc1038efbb7aa3bbd8c/content_scripts/highlight.js#L329

    function myGoodFilter(node) {
        var good_tags_list = [
            "PRE",
            "A",
            "P",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "B",
            "SMALL",
            "STRONG",
            "Q",
            "DIV",
            "SPAN",
            "LI",
            "TD",
            "OPTION",
            "I",
            "BUTTON",
            "UL",
            "CODE",
            "EM",
            "TH",
            "CITE",
        ];
        if (good_tags_list.indexOf(node.parentNode.tagName) !== -1) {
            return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
    }

    let textNode;



    while (textNode = nodeIterator.nextNode()) {

        for (let wordObj of myList) {
            // if (textNode.textContent.split(" ").length > 4) {
            //     if (textNode.textContent.split(" ").includes(wordObj.word)) {
            //         const renderNode = document.createElement('span');
            //         renderNode.className = 'hooli-textnode'
            //         renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${wordObj.word}<rt>${wordObj.alias}</rt></ruby>`)
            //         textNode.replaceWith(renderNode)
            //         console.log('有2')
            //     } break;
            // }
            if (textNode.textContent.includes(wordObj.word)) {
                const renderNode = document.createElement('span');
                renderNode.className = 'hooli-textnode'
                renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${DOMPurify.sanitize(wordObj.word)}<rt>${DOMPurify.sanitize(wordObj.alias)}</rt></ruby>`)
                textNode.replaceWith(renderNode)
                console.log('有');
            }

        }
        // myList.forEach(wordObj => {
        //     if (textNode.textContent.split(" ").length > 4) {
        //         if (textNode.textContent.split(" ").includes(wordObj.word)) {
        //             const renderNode = document.createElement('span');
        //             renderNode.className = 'hooli-textnode'
        //             renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${wordObj.word}<rt>${wordObj.alias}</rt></ruby>`)
        //             textNode.replaceWith(renderNode)
        //             console.log('有2')
        //         } 
        //     }

        // if (textNode.textContent.includes(wordObj.word)) {
        //     const renderNode = document.createElement('span');
        //     renderNode.className = 'hooli-textnode'
        //     // const rubyNode = document.createElement('ruby')
        //     // rubyNode.className = 'hooli-textnode'
        //     // const rtOfRuby = document.createElement('rt');
        //     // rtOfRuby.className = 'hooli-textnode'
        //     renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${wordObj.word}<rt>${wordObj.alias}</rt></ruby>`)
        //     textNode.replaceWith(renderNode)
        //     console.log('有');
        // }
        // }
        // )
    }

}


const observer = new MutationObserver((mutations) => {
    // console.log(mutations);
    console.log('abcd');
})

let myList = [];
chrome.storage.local.get("myWordList", function (obj) {
    if (obj.myWordList && obj.myWordList.length > 0) {
        myList = obj.myWordList
        renderRuby()
        observer.observe(document, body, { childList: true, subtree: true, characterData: true })
    }
})
