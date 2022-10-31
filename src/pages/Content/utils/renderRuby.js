import '../components/customElements/HolliText';
import '../components/customElements/HooliWordInfoBlock'


export let wordInPageList = []

const getCurrentURL = ()=>{
    return window.location.href.slice(0, window.location.href.lastIndexOf(window.location.hash)) 
}
let currentURL = getCurrentURL()


export const clearNoLongerExistWordInWordInPageList = ()=>{
    const transformElementIdToWordId = (eleId)=>{
        const splittedEleId = eleId.split('-')
        return splittedEleId.slice(1, splittedEleId.length-1).join('-')
    }
    
    const wordIdOfHooliTextsOnDoc = []
    document.querySelectorAll('hooli-text').forEach(ele=>{
        const wordId = transformElementIdToWordId(ele.id)
        if(wordIdOfHooliTextsOnDoc.indexOf(wordId) < 0) wordIdOfHooliTextsOnDoc.push(wordId)
    })

    wordInPageList = wordInPageList.filter(wordObj=>{
        if(wordIdOfHooliTextsOnDoc.indexOf(wordObj.id) < 0) return false
        return true
    })
}


const putHooliTextOnNode = (targetNode, wordList, setting)=>{

    for (let wordObj of wordList) {
                
        let matchText = (wordObj.stem || wordObj.word)

        const langRegex = new RegExp(/\p{sc=Hani}|\p{sc=Hira}|\p{sc=Kana}|\p{sc=Hang}/, 'um')
        const boundaryRegex = new RegExp(`\\b${matchText}`, 'im')
            //languages do not  have word separator (which means can't use /b as word boundary):
            //Thai, Lao, Khmer, Chinese, Japanese, Korean
            //further reading: https://www.w3.org/International/articles/typography/linebreak

            //languages may need to deal with the capitalization(first letter as a capital letter) situation
            //Latin, Armenian, Cyrillic, Georgian, Greek alphabets.
            //unicode script: Latn, Grek, Cyrl,Geor


        if (targetNode.textContent.indexOf(matchText) > -1) {
            

            if (!langRegex.test(matchText) && !boundaryRegex.test(targetNode.textContent)) return

            const sentenceWithoutWord = targetNode.textContent.split(matchText)
            const countMatchedTime = sentenceWithoutWord.length - 1

            const theWordInTheList = wordInPageList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)
            if (!theWordInTheList) {
                
                if(getCurrentURL() !== currentURL){
                    currentURL = getCurrentURL()
                    clearNoLongerExistWordInWordInPageList()
                }

                wordInPageList.push({ ...wordObj, countInCurrentPage: countMatchedTime, currentContext: targetNode.textContent })
                chrome.runtime.sendMessage({ action: 'updateWordCount', count: wordInPageList.length })
                if (setting.floatingWindow) {
                    const wordListEle = document.querySelector('hooli-floating-word-list')
                    wordListEle.requestUpdate()
                    
                }
            }else{
                wordInPageList.map(wordObjInList=>{
                   if(wordObj.id === wordObjInList.id){
                    wordObjInList.countInCurrentPage += countMatchedTime
                    return wordObjInList
                   }

                   return wordObjInList
                })
            }
            const updatedWordInTheList = wordInPageList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)

            const createTheWordNode = (wordObj, count) => {
                const word = matchText
                const renderNode = document.createElement('hooli-text')
                renderNode.wordObj = wordObj
                renderNode.textContent = word
                renderNode.wordId = wordObj.id
                renderNode.id = `h-${wordObj.id}-${updatedWordInTheList.countInCurrentPage - countMatchedTime + count + 1}`
                //id start from 1 not 0
                return renderNode
            }

            const fragment = new DocumentFragment()

            sentenceWithoutWord.forEach((sentence, i) => {
                if (i === sentenceWithoutWord.length - 1) {
                    fragment.append(sentence)
                } else {
                    fragment.append(sentence, createTheWordNode(wordObj,i))

                }
            })

            // const allHooliText = fragment.querySelectorAll('hooli-text')
            // allHooliText.forEach(hooliText => {
            //     observerForIntersection.observe(hooliText)
            // })

            const span = document.createElement('span')
            targetNode.replaceWith(span);
            span.replaceWith(fragment)

        }

    }


}


export const renderMultipleRuby = (nodesArray, wordList, setting)=>{

    console.log('renderRuby execute', setting)
    const performanceStart = performance.now()

        nodesArray.forEach((node=>{
            renderRuby(node, wordList, setting, false)
        }))

            
        const performanceEnd = performance.now()
        console.log(`RenderRuby time ${(performanceEnd - performanceStart).toFixed(2)} ms`)

}


export const renderRuby = (target, wordList, setting, isStart) => {
    
    
    const nodeIterator = document.createNodeIterator(target, NodeFilter.SHOW_TEXT, myGoodFilter);
    // mygoodfilter source:
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
            putHooliTextOnNode(textNode, wordList, setting)
        }
    


};
