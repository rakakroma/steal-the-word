import { showWordList, wordInPageList } from '../components/infoSection'
import '../components/HolliText';
import { getSentenceFromSelection } from './get-selection-more';
import { breadcrumbsClasses } from '@mui/material';
import { observerForIntersection } from './observerForIntersection';
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
                    const createTheWordNode = (wordObj) => {
                        const word = matchText
                        const alias = wordObj.pronounce || wordObj.definitions[0].aliases[0]
                        const renderNode = document.createElement('hooli-text')
                        renderNode.alias = alias
                        renderNode.textContent = word
                        renderNode.wordId = wordObj.id
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
    
                            if (['absolute', 'relative'].includes(window.getComputedStyle(document.body).position)) {
                                //some bug in 'absolute'
                                // wordBlock.style.bottom = `${window.innerHeight - hooliText.getBoundingClientRect().top + 4}px`
                                wordBlock.style.bottom = `${parseFloat(window.getComputedStyle(document.body).height) -
                                    window.scrollY - hooliText.getBoundingClientRect().top + 20}px`
                                wordBlock.style.left = `${hooliText.getBoundingClientRect().left + hooliText.offsetWidth / 2}px`
                            } else {
                                wordBlock.style.bottom = `${window.innerHeight - window.scrollY - hooliText.getBoundingClientRect().top + 2}px`
                                wordBlock.style.left = `${window.scrollX + hooliText.getBoundingClientRect().left + hooliText.offsetWidth / 2}px`
    
                            }
                            // document.addEventListener('mousedown', e => {
                            //     if (e.composedPath()[0].tagName === 'HOOLI-HIGHLIGHTER') {
                            //         console.log(e.composedPath()[1].id)
                            //         wordBlock.phraseSelectionTarget = e.composedPath()[1].id
                            //     }
                            //     // if (e.composedPath()[0] !== 'HOOLI-WORDINFO-BLOCK') return
                            //     // document.addEventListener('selectionchange', () => {
                            //     //     console.log(document.getSelection().toString())
                            //     // })
                            // })
    
                            const handleClose = (e) => {
                                if (e.composedPath().includes(wordBlock)) return
                                document.body.removeChild(wordBlock)
                                window.removeEventListener('mouseup', handleClose)
                            }
                            window.addEventListener('mouseup', handleClose)
                            document.body.appendChild(wordBlock)
                        })
    
                        observerForIntersection.observe(hooliText)
                    })
    
    
                    const span = document.createElement('span')
                    textNode.replaceWith(span);
                    span.replaceWith(fragment)
    
    
    
                    // if (wordInPageList) {
                    let theWordInList = wordInPageList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)
                    if (!theWordInList) {
                        wordInPageList.push({ ...wordObj, countInCurrentPage: 1, currentContext: textNode.textContent })
                        chrome.runtime.sendMessage({ action: 'updateWordCount', count: wordInPageList.length })
                        if (setting.floatingWindow) {
                            showWordList()
                        }
                    }
    
                    // else {
                    //     theWordInDisplayList.countInCurrentPage += 1
                    // }
                    // console.log(displayList[0].countInCurrentPage)
    
                    // }
                }
    
            }
        }
    
        const performanceEnd = performance.now()
        console.log(`RenderRuby time ${performanceEnd - performanceStart} ms`)
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
