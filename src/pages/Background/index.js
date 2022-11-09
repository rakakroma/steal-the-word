import { getDataInTableFromIndexedDB } from "../Options/utils/getDataFromDB";
// import { getDomain } from "../Options/utils/transformData";
import { db } from "./database";

const blobToBase64=(blob)=>{
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

// console.log('This is the background page.');
// console.log('Put the background scripts here.');


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


const saveDomainData = async (currentDomain, favIconUrl) => {
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
        if(request.action === 'getFaviconThisSite'){
            sendResponse({iconUrl:sender.tab.favIconUrl})
        }
        if (request.action === 'notWorking') {
            chrome.action.setBadgeText({ text: 'STOP', tabId: sender.tab.id })
        }
        if (request.action === 'updateWordCount' && request.count) {
            chrome.action.setBadgeText({ text: `${request.count}`, tabId: sender.tab.id })
        }
        if (request.action === 'getStart' && request.url) {
            (async () => {
                console.log('getstart');
                const currentDomain = new URL(request.url).hostname;
                const domainData = await db.domainAndLink.get({ url: currentDomain });
                if (domainData?.activate === false) {
                    sendResponse({ activate: false })
                    return
                }
                const sortedWordList = await getDataInTableFromIndexedDB('wordList').then(wordList => {
                    return wordList.sort((a, b) => b.word.length - a.word.length)
                })

                if (!domainData) {
                    sendResponse({ wordList: sortedWordList })
                    return
                }


                sendResponse({ wordList: sortedWordList, domainData })
            })();
        }
        if (request.action==='getImgDataFromUrls' && request.domains) {
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

        if (request.action === 'saveWordAndContext' && request.newWord && request.newContext) {
            const theWordObj = { ...request.newWord }
            const theContextObj = { ...request.newContext }
            const currentDomain = new URL(theContextObj.url).hostname;

            const saveTheWord = async () => {
                const sameWordInDB = await db.wordList.get({ word: theWordObj.word })

                if (sameWordInDB) {
                    db.contextList.add(theContextObj)
                    sendResponse({ 
                        status:'existWord',
                        message: `you already have ${request.newWord.word}`
                     })
                    return false
                }

                db.wordList.add(theWordObj)
                db.contextList.add(theContextObj)
                return true
            }
             (async () => {
                const saveSuccess = await saveTheWord()
                if(!saveSuccess) return
                await saveDomainData(currentDomain, sender.tab.favIconUrl)
                sendResponse({ 
                    status:'success',
                    message: `got ${request.newWord.word}`
                 })
            })();
        }
        if(request.action === 'addNewContextForSavedWord' && request.newContext){
            const theContextObj = { ...request.newContext };
            const currentDomain = new URL(theContextObj.url).hostname;
            (async()=>{
                await db.contextList.add(theContextObj)
                await saveDomainData(currentDomain, sender.tab.favIconUrl)
                sendResponse({
                    status:'success',
                    message: `saved ${theContextObj.context}`
                })
            })()
        }
        if(request.action === 'addNewContextAndDefinitionForSavedWord' && request.newContext && request.updatedDefinitions && request.definitionCount){
            const {newContext, updatedDefinitions, definitionCount} = request;

            (async()=>{
                await db.contextList.add(newContext)
                await db.wordList.update({id:newContext.wordId}, {definitions:updatedDefinitions, definitionCount})
                sendResponse({
                    status:'success',
                    message: `saved and update definition`
                })
            })()
        }

        if(request.action === 'deleteThisWordObjAndAllItsContexts' && request.wordId && request.contextIdsToDelete){
            const {wordId, contextIdsToDelete} = request
            const deleteWordAndContextsByWordId = async()=>{
                await db.wordList.delete(wordId)
                await db.contextList.bulkDelete(contextIdsToDelete)
                sendResponse({
                status:'success', 
                message:`delete ${wordId}, contexts ${contextIdsToDelete.join(', ')}`
            })
            }
            deleteWordAndContextsByWordId()
        }
        if(request.action === 'deleteContexts' && request.contextIdsToDelete){
            const {contextIdsToDelete} = request;
            if(contextIdsToDelete.length === 0) return //error
                (async()=>{
                    // const contextDataShouldBeDeleted = db.contextList.bulkGet(contextIdsToDelete)
                    await db.contextList.bulkDelete(contextIdsToDelete)
                    sendResponse({
                        status:'success',
                        message:`delete contexts ${contextIdsToDelete.join(', ')}`
                    })
                })()
            
        }
        if(request.action === 'deleteContextsAndDefinitions' && 
        request.newDefinitions && 
        request.wordId &&
        request.contextIdsToDelete){
            const {newDefinitions, contextIdsToDelete, wordId} = request;
            if(newDefinitions.length === 0) return //error
            if(contextIdsToDelete.length === 0) return //error
            (async()=>{
                await db.contextList.bulkDelete(contextIdsToDelete)
                await db.wordList.update({id:wordId}, {definitions:newDefinitions})
                sendResponse({
                    status:'success',
                    message:`delete contexts ${contextIdsToDelete.join(', ')} and definition`
                })
            })()

        }
        if(request.action === 'changePhraseToContext' && request.contextId && request.phrase){
            const  {contextId, phrase} = request
            const changePhraseByContextId = async()=>{
                await db.contextList.update({id:contextId}, {phrase})
                sendResponse({
                    status:'success'
                })
            }
            changePhraseByContextId()
        }
        if(request.action === 'editWord'){
            const {wordId,word, definitions, stem, variants, matchRule} = request;
            const wordObjToUpdate = {word, definitions};
            if(stem) wordObjToUpdate.stem = stem;
            if(variants) wordObjToUpdate.variants = variants;
            if(matchRule) wordObjToUpdate.matchRule = matchRule;
             (async()=>{
                await db.wordList.update({id:wordId}, wordObjToUpdate)
                sendResponse({
                    status:'success'
                })
            })()
        }
        return true
    });


