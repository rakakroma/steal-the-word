// import DOMPurify from 'dompurify';

export const renderRuby = (doc, wordList, displayList) => {

    const nodeIterator = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, myGoodFilter);

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

        for (let wordObj of wordList) {
            // if (textNode.textContent.split(" ").length > 4) {
            //     if (textNode.textContent.split(" ").includes(wordObj.word)) {
            //         const renderNode = doc.createElement('span');
            //         renderNode.className = 'hooli-textnode'
            //         renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${wordObj.word}<rt>${wordObj.alias}</rt></ruby>`)
            //         textNode.replaceWith(renderNode)
            //         console.log('有2')
            //     } break;
            // }
            if (textNode.textContent.includes(wordObj.word)) {
                const renderNode = document.createElement('span');
                renderNode.className = 'hooli-textnode';
                const shadowNode = renderNode.attachShadow({ mode: 'open' })
                const rubyElement = document.createElement('ruby')
                const rtElement = document.createElement('rt')
                rtElement.textContent = wordObj.alias
                rubyElement.textContent = wordObj.word
                rubyElement.appendChild(rtElement)
                shadowNode.appendChild(rubyElement)
                const sentenceWithoutWord = textNode.textContent.split(wordObj.word)
                const fragment = new DocumentFragment()

                //不知道為什麼這樣做最後面不會多一個ruby元素，但 it just works。
                //明明用了shadow DOM但瀏覽器裡他直接被忽略，看不到shadow-root及span，不設shadow的話則會出現奇怪的錯誤結果（ruby元素被提到最後面）。
                sentenceWithoutWord.forEach(sentence => {
                    fragment.append(sentence, shadowNode)
                })
                // shadowNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${DOMPurify.sanitize(wordObj.word)}<rt>${DOMPurify.sanitize(wordObj.alias)}</rt></ruby>`);
                textNode.replaceWith(fragment);



                if (displayList) {
                    let theWordInDisplayList = displayList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)
                    if (!theWordInDisplayList) {
                        displayList.push({ ...wordObj, countInCurrentPage: 1 })
                    } else {
                        theWordInDisplayList.countInCurrentPage += 1
                    }

                    console.log(displayList)

                }
            }

        }
    }

};
