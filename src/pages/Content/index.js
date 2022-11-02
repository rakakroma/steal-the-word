// import React from 'react';
// import { render } from 'react-dom';
// import { shadowAppTopStyle } from './shadowApp.style';
import { renderRuby,renderMultipleRuby } from './utils/renderRuby';
// import { showWordList } from './components/infoSection'
import './components/customElements/HolliText';
import './components/customElements/wordListMinimizedBar'
import { setWordBlockPosition } from './utils/setWordBlockPosition'
import {ReactComponent} from './components/ReactComponent.jsx'
import {openAddNewWord} from './components/customElements/HolliText'


//第二個重要功能：已上色的ruby要能夠很快的儲存新例句／片語

console.log('Content script works!');


const body = document.body
const currentURL = window.location.hash ?
    window.location.href.slice(0, window.location.href.lastIndexOf(window.location.hash)) :
    window.location.href

const init = () => {

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
let newAddedNodes = []
let newRemovedNodes = []
// let clearedIntervalId = null
let runningIntervalId = null

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        visible = true
    } else {
        visible = false
    }
  });

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation=>{
        if(mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(addedNode=>{
                newAddedNodes.push(addedNode)
            })
            // console.log('new added nodes')
            // console.log(newAddedNodes)
        }
        
        if(mutation.removedNodes.length > 0 ){
            mutation.removedNodes.forEach(removedNode=>{
                newRemovedNodes.push(removedNode)
            })
        }

    })

    if (visible) {
 
        if(runningIntervalId) return 
        const checkIfNewNodes = setInterval(() => {
            if(!visible || newAddedNodes.length === 0) {
                clearInterval(checkIfNewNodes)
                runningIntervalId = null
                return
            }
            const nodesToHandle = newAddedNodes.filter(addedNode =>{
                    if(newRemovedNodes.indexOf(addedNode) > -1) {
                    return false
                } 
                    if(addedNode.tagName?.includes('HOOLI')) return false
                return true
            })
            if(nodesToHandle.length === 0){
                clearInterval(checkIfNewNodes)
                runningIntervalId = null
                newAddedNodes = []
                newRemovedNodes=[]    
                return
            }
            renderMultipleRuby(nodesToHandle, myList, {floatingWindow})

            newAddedNodes = []
            newRemovedNodes = []

        }, 3000);
        runningIntervalId = checkIfNewNodes


        // timeout = setTimeout(() => {
        //     newAddedNodes.filter(addedNode=>{
        //         if(newRemovedNodes.indexOf(addedNode) > -1) {
        //             console.log('offset')
        //             return false
        //         } 
        //         return true
        //     })
        //     newAddedNodes = []
        //     newRemovedNodes=[]
        // },2000)
            // renderRuby(document.body, myList, { floatingWindow })
            //  })
    }
}
)




export let myList = [];
let whiteList = []
export let floatingWindow = false
let connect = false;


export const restoreHolliText = (wordId)=>{
    let targetEles;
    if(!wordId) {
        targetEles = document.querySelectorAll('holli-text')
    }else{
        targetEles = document.querySelectorAll(`.h-${wordId}`)
    }
    targetEles.forEach(ele=>{
     const fragment = new DocumentFragment()
     fragment.textContent = ele.textContent
     ele.replaceWith(fragment)
    })
    myList = myList.filter(wordObj=>wordObj.id !== wordId)
 }

function startFunction(){
//test i18n
chrome.i18n.getAcceptLanguages(result=>console.log('accept lang:',result))
console.log('ui lang:',chrome.i18n.getUILanguage())

//
    chrome.storage.local.get([
        'activate', 'mouseTool', 'floatingWindow'], function (obj) {
            console.log(obj)
            if (obj.activate === false) {
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

                    const wordListElement=  document.createElement('hooli-floating-word-list')

                    // const rootDiv = document.createElement('div')
                    // const shadow = rootDiv.attachShadow({mode:'open'})
                    // const shadowRoot = rootDiv.shadowRoot
                    // shadowRoot.innerHTML = `#test-react {
                    //     all: initial;
                    //     background-color: rgb(239, 239, 239);
                    //     width: 200px;
                    //     color: rgb(0, 0, 0);
                    //     position: fixed;
                    //     top: 150px;
                    //     right: 20px;
                    //     z-index: 999999999990;
                    //     overflow-y: overlay;
                    //     display: flex;
                    //     flex-direction: column;
                    //     border: 1px solid grey;
                    //   }
                    //   `
                    // render(<ReactComponent />, shadowRoot)
                    // body.appendChild(rootDiv)
                    body.appendChild(wordListElement)
                }
                if (res.wordList.length > 0) {
                    myList = res.wordList
                    let loadEvent = false
                    const startAfterLoaded = () => {
                        console.log('page loaded')
                        loadEvent = true
            renderRuby(document.body, myList, { floatingWindow }, true)
                        observer.observe(body, { childList: true, subtree: true, characterData: true })
                        window.removeEventListener('load', startAfterLoaded)
                    }
                    window.addEventListener('load', startAfterLoaded())
                    setTimeout(() => {
                        if (!loadEvent) {
                renderRuby(document.body, myList, { floatingWindow }, true)
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
    if(message.action==='save word'){
        openAddNewWord()
    }
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
            renderRuby(document.body, myList, { floatingWindow })
            // showWordList()
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
renderRuby(document.body, myList, { floatingWindow })
            console.log('close')
            sendResponse({ content: "已關閉wordList" })
        })
        return true;
    }
    else {
        sendResponse({ content: 'content script 已收到訊息' })
    }
});


