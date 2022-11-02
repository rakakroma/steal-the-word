import { getDataInTableFromIndexedDB } from "../Options/utils/getDataFromDB";
// import { getDomain } from "../Options/utils/transformData";
import { db } from "./database";

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


console.log('This is the background page.');
console.log('Put the background scripts here.');


const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
chrome.action.setBadgeBackgroundColor({ color: '#4f4f4f' })


    chrome.contextMenus.create({
        "title": 'Save "%s" to HolliRuby',
        "contexts": ["selection"],
        "id": "myContextMenuId"
    });
    
chrome.contextMenus.onClicked.addListener((info, tab)=> {
    chrome.tabs.sendMessage(tab.id,{action:'save word'})
})


const saveDomainData = async (currentDomain) => {
    const { favIconUrl } = await getCurrentTab()
    if (favIconUrl) {
        let res;
        let blob;
        const domainInDB = await db.domainAndLink.get({ url: currentDomain }) //and the custom url
        if (!domainInDB) {
            res = await fetch(favIconUrl)
            blob = await res.blob()

            const newDomain = {
                url: currentDomain,
                dynamicRendering: true,
                icon: blob,
                showTabWords: null,
                tags: null,
                lang: null
            }
            db.domainAndLink.add(newDomain)
            console.log(newDomain);

        } else if (!domainInDB.icon) {
            console.log(domainInDB);
            db.domainAndLink.update({ url: currentDomain }, { "icon": blob })
            console.log('update icon')
        }
    }
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(request, sender.tab.id)
        if (request.action === 'sendResponse') {
            sendResponse({ message: 'ok I sent it' })
        }
        if(request.action === 'Hollinize' && request.targetNode){
            request.targetNode.textContent = 'okokokokok'
            sendResponse(request.targetNode)
        }



        if(request.action === 'getFaviconThisSite'){
            // const { favIconUrl } = await getCurrentTab()
            // if (favIconUrl) {
            //     let res;
            //     let blob;
            //     const domainInDB = await db.domainAndLink.get({ url: currentDomain }) //and the custom url
            //         res = await fetch(favIconUrl)
            //         blob = await res.blob()
            // }
            let iconUrl ;
            getCurrentTab().then(tabInfo=> {
                iconUrl = tabInfo.favIconUrl}).then(()=>{
                    sendResponse({iconUrl})
                })
        }
        if (request.action === 'notWorking') {
            chrome.action.setBadgeText({ text: 'STOP', tabId: sender.tab.id })
        }
        if (request.action === 'updateWordCount' && request.count) {
            chrome.action.setBadgeText({ text: `${request.count}`, tabId: sender.tab.id })
        }
        if (request.action === 'getStart' && request.url) {
            (async () => {
                console.log('getstart')
                const currentDomain = new URL(request.url).hostname
                const sortedWordList = await getDataInTableFromIndexedDB('wordList').then(wordList => {
                    return wordList.sort((a, b) => b.word.length - a.word.length)
                })
                const domainData = await db.domainAndLink.get({ url: currentDomain })
                if (!domainData) {
                    sendResponse({ wordList: sortedWordList })
                    return
                }
                if (domainData.activate === false) {
                    sendResponse({ activate: false })
                    return
                }

                sendResponse({ wordList: sortedWordList, domainData })
            })()
        }
        if (request.domains) {
            const getDomainDataByUrls = async (domains) => {
                const domainData = await Promise.all(domains.map(async (domain) => {
                    const gotDomainObj = await db.domainAndLink.get({ url: domain })
                    gotDomainObj.img = await blobToBase64(gotDomainObj.icon)
                    delete gotDomainObj.icon
                    return gotDomainObj
                }))
                sendResponse({ domainData })
            }
            getDomainDataByUrls(request.domains)

        }
        if (request.wordId && request.action === 'getContexts') {
            const getContextByWordId = async (wordId) => {
                const contexts = await db.contextList.filter((contextObj) => {
                    return contextObj.wordId === wordId
                }).toArray()
                // console.log(contexts)
                sendResponse({ contexts })
            }
            getContextByWordId(request.wordId)
        }

        // if (request.message === 'i give you') sendResponse({ message: 'ok i know' })
        if (request.newWord && request.newContext) {
            const theWordObj = { ...request.newWord }
            const theContextObj = { ...request.newContext }
            const currentDomain = new URL(theContextObj.url).hostname

            const saveTheWord = async () => {
                const sameWordInDB = await db.wordList.get({ word: theWordObj.word })

                if (sameWordInDB) {
                    db.contextList.add(theContextObj)
                    // console.log(contextToAdd)
                    sendResponse({ message: `已經有了${request.newWord.word}` })
                    return
                }

                db.wordList.add(theWordObj)
                db.contextList.add(theContextObj)
                // console.log(theWordObjToAdd)
                // console.log(contextToAdd)

            }
            const doAndResponse = async () => {
                await saveTheWord()
                await saveDomainData(currentDomain)
                sendResponse({ message: `got ${request.newWord.word}` })
            }

            doAndResponse()
        }
        if(request.action === 'addNewContextForSavedWord' && request.newContext){
            const theContextObj = { ...request.newContext }
            const currentDomain = new URL(theContextObj.url).hostname
            const addContextAndDomain = async()=>{
                await db.contextList.add(theContextObj)
                await saveDomainData(currentDomain)
                sendResponse({message: `saved ${theContextObj.context}`})
            }
            addContextAndDomain()
        }
        if(request.action === 'deleteThisWordObjAndAllItsContexts' && request.wordId && request.contextIdsToDelete){
            const {wordId, contextIdsToDelete} = request
            const deleteWordAndDomainObjByWordId = async()=>{
                await db.wordList.delete(wordId)
                await db.contextList.bulkDelete(contextIdsToDelete)
                sendResponse({
                status:'success', 
                message:`delete ${wordId}, contexts ${contextIdsToDelete.join(', ')}`
            })
            }
            deleteWordAndDomainObjByWordId()
        }
        if(request.action === 'deleteTheseContexts' && request.contextIdsToDelete){
            const {contextIdsToDelete} = request
            if(contextIdsToDelete.length > 0){
                const deleteContextsByContextIds = async()=>{
                    await db.contextList.delete(contextIdsToDelete)
                    sendResponse({
                        status:'success',
                        message:`delete contexts ${contextIdsToDelete.join(', ')}`
                    })
                }
                deleteContextsByContextIds()
            }
        }
        return true
    });


