import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
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


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.message === "hi") sendResponse({ message: "hi to you" });
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
        if (request.wordId) {
            const getContextByWordId = async (wordId) => {
                const contexts = await db.contextList.filter((contextObj) => {
                    return contextObj.wordId === wordId
                }).toArray()
                // console.log(contexts)
                sendResponse({ contexts })
            }
            getContextByWordId(request.wordId)
        }
        if (request.message === 'give me word list') {
            const sendDBdata = async () => {
                const allWordList = await getDataInTableFromIndexedDB('wordList')
                sendResponse({ wordList: allWordList })
            }
            sendDBdata()
        }
        // if (request.message === 'i give you') sendResponse({ message: 'ok i know' })
        if (request.newWord && request.newContext) {
            const theWordObj = { ...request.newWord }
            const theContextObj = { ...request.newContext }
            const currentDomain = new URL(theContextObj.url).hostname

            const getCurrentTab = async () => {
                let queryOptions = { active: true, lastFocusedWindow: true };
                // `tab` will either be a `tabs.Tab` instance or `undefined`.
                let [tab] = await chrome.tabs.query(queryOptions);
                return tab;
            }

            const saveDomainData = async () => {
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
            const sendSomeResponse = async () => {
                await saveTheWord()
                await saveDomainData()
                sendResponse({ message: `got ${request.newWord.word}` })
            }

            sendSomeResponse()
        }
        return true
    });


// console.log("theList", theList)