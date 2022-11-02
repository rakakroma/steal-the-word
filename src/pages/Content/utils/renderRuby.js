import { showWordList, wordInPageList } from '../components/infoSection'
import '../components/customElements/HolliText';
import '../components/customElements/HooliWordInfoBlock'
import { getSentenceFromSelection } from './get-selection-more';
import { observerForIntersection } from './observerForIntersection';
import {setWordBlockPosition} from './setWordBlockPosition'

// import { getDomain } from '../../Options/utils/transformData';

// const defaultRubyStyle = {
//     ruby: {
//         // backgroundColor: '#dbdbdb',
//         rubyPosition: "",
//         // textDecoration: 'underline #62b856',
//         // color: '#000000',
//         // 'fontSize': '1.5rem',
//         background: "linear-gradient(transparent 60%, #5bffba 50%)"
//         // border: '',
//     },
//     rt: {
//         display: "none",
//         color: '#1c1a1a',
//         textDecoration: '',
//         backgroundColor: '#f0dedd',
//         // fontFamily: "Arial Black"
//     }
// }

let coldTime = false
let timeout = null
// let startDelay = false

export const renderRuby = (doc, wordList, setting, isStart) => {



    
    const doJob = ()=>{

        console.log('renderRuby execute', setting)
    
        const performanceStart = performance.now()
    
        const nodeIterator = doc.createNodeIterator(doc.body, NodeFilter.SHOW_TEXT, myGoodFilter);
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
            if (good_tags_list.indexOf(node.parentNode.tagName) !== -1
                // && node.parentElement.contentEditable !== 'true'
            ) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
        }
    
        let textNode;
    
    
    
        while (textNode = nodeIterator.nextNode()) {
            //languages not having word separator (which means can't use /b as word boundary):
            //Thai, Lao, Khmer, Chinese, Japanese, Korean
            //further reading: https://www.w3.org/International/articles/typography/linebreak
    
            for (let wordObj of wordList) {
                
                let matchText = (wordObj.stem || wordObj.word)
    
                const langRegex = new RegExp(/\p{sc=Hani}|\p{sc=Hira}|\p{sc=Kana}|\p{sc=Hang}/, 'um')
                const boundaryRegex = new RegExp(`\\b${matchText}`, 'im')
    
                if (textNode.textContent.includes(matchText)) {
    
                    if (!langRegex.test(matchText) && !boundaryRegex.test(textNode.textContent)) {
                        // console.log("can't pass", matchText, textNode)
                        break;
                    } else {
                        // console.log("passed", matchText, textNode)
                    }

                    const theWordInList = wordInPageList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)
                    if (!theWordInList) {
                        wordInPageList.push({ ...wordObj, countInCurrentPage: 1, currentContext: textNode.textContent })
                        wordInPageList.forEach(wordObjInList=>{
                            console.log(wordObjInList.word, wordObjInList.countInCurrentPage)
                        })
                        chrome.runtime.sendMessage({ action: 'updateWordCount', count: wordInPageList.length })
                        if (setting.floatingWindow) {
                            // showWordList()
                            const wordListEle = document.querySelector('hooli-floating-word-list')
                            // wordListEle.wordListInThisPage = [...wordInPageList]
                            // wordListEle.testText += 'お'
                            wordListEle.requestUpdate()
                            // console.log(wordListEle.testText)
                            // console.log(wordListEle.wordListInThisPage.map(wordObj=>wordObj.word))
                            
                        }
                    }else{
                        wordInPageList.map(wordObjInList=>{
                           if(wordObj.id === wordObjInList.id){
                            wordObjInList.countInCurrentPage ++
                            return wordObjInList
                           }

                           return wordObjInList
                        })
                    }
    

                    const createTheWordNode = (wordObj) => {
                        const word = matchText
                        const alias = wordObj.pronounce || wordObj.definitions[0].aliases[0]
                        const renderNode = document.createElement('hooli-text')
                        renderNode.alias = alias
                        renderNode.textContent = word
                        renderNode.wordId = wordObj.id
                        renderNode.id = `h-${wordObj.id}-${theWordInList?.countInCurrentPage|| 1}`
                        return renderNode
                    }
    
    
                    const sentenceWithoutWord = textNode.textContent.split(matchText)
                    const fragment = new DocumentFragment()
    
                    sentenceWithoutWord.forEach((sentence, i) => {
                        if (i === sentenceWithoutWord.length - 1) {
                            fragment.append(sentence)
                        } else {
                            fragment.append(sentence, createTheWordNode(wordObj))
    
                        }
                    })
    
    
                    const allHooliText = fragment.querySelectorAll('hooli-text')
    
                    allHooliText.forEach(hooliText => {
    
                        hooliText.addEventListener('click', () => {
                            const wordBlock = document.createElement('hooli-wordinfo-block')
                            // let context = '...'
                            let contextHere = ''
                            chrome.runtime.sendMessage({ wordId: wordObj.id }, (response) => {
                                wordBlock.contexts = response.contexts
                                // console.log(response.contexts)
                                const allDomains = response.contexts.map(contextObj => {
                                    return new URL(contextObj.url).hostname
                                })
                                chrome.runtime.sendMessage({ domains: allDomains }, (response) => {
                                    wordBlock.imgSrcs = response.domainData
                                })
                            })
    
                            // wordBlock.alias = wordObj.pronounce || wordObj.definitions[0].aliases[0];
                            wordBlock.wordObj = wordObj
                            wordBlock.context = ''
                            wordBlock.contextHere = contextHere
    
                            const range = document.createRange()
                            range.selectNode(hooliText)
                            window.getSelection().removeAllRanges()
                            window.getSelection().addRange(range)
                            wordBlock.contextHere = getSentenceFromSelection(document.getSelection())
                            window.getSelection().removeAllRanges()
                            
                            // const holliTextClientRect = hooliText.getBoundingClientRect()

                           
                            setWordBlockPosition(hooliText, wordBlock)

                                       document.body.appendChild(wordBlock)
                        })
    
                        observerForIntersection.observe(hooliText)
                    })
    
    
                    const span = document.createElement('span')
                    textNode.replaceWith(span);
                    span.replaceWith(fragment)
    
    
    
                    // if (wordInPageList) {
              
                    // else {
                    //     theWordInDisplayList.countInCurrentPage += 1
                    // }
                    // console.log(displayList[0].countInCurrentPage)
    
                    // }
                }
    
            }
        }
    
        const performanceEnd = performance.now()
        console.log(`RenderRuby time ${(performanceEnd - performanceStart).toFixed(2)} ms`)
    }


    if(coldTime){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            coldTime = false
            renderRuby(doc, wordList, setting, true)
        },2000)
        return
    }

    coldTime = true
  
    if(!isStart) {
        timeout = setTimeout(()=>{
            renderRuby(doc, wordList, setting, true)
            coldTime = false
        },2000)
        return
    }
        timeout = setTimeout(()=>{
            coldTime = false
        },2000)
    
   
    doJob()

};
