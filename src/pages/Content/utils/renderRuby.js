import { showWordList } from '../components/infoSection'

const defaultRubyStyle = {
    ruby: {
        // backgroundColor: '#dbdbdb',
        rubyPosition: "",
        // textDecoration: 'underline #62b856',
        // color: '#000000',
        // 'fontSize': '1.5rem',
        background: "linear-gradient(transparent 60%, #5bffba 50%)"
        // border: '',
    },
    rt: {
        display: "none",
        color: '#1c1a1a',
        textDecoration: '',
        backgroundColor: '#f0dedd',
        // fontFamily: "Arial Black"
    }
}



export const renderRuby = (doc, wordList, displayList, setting) => {

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
                renderNode.className = 'hooli-span-node';

                // const shadowNode = renderNode.attachShadow({ mode: 'open' })
                const rubyElement = document.createElement('ruby')
                rubyElement.className = 'holli-ruby-element'
                rubyElement.setAttribute('data-alias', wordObj.alias)
                const rtElement = document.createElement('rt')
                const hoverDiv = document.createElement('div')
                hoverDiv.className = 'hover-div'


                rtElement.textContent = wordObj.alias
                rubyElement.textContent = wordObj.word
                rubyElement.appendChild(rtElement)
                renderNode.appendChild(rubyElement)

                renderNode.style.all = 'initial'
                renderNode.style.color = 'inherit'
                renderNode.style.font = 'inherit'
                renderNode.style.position = 'relative'
                rubyElement.style.position = 'relative'
                rubyElement.style.background = defaultRubyStyle.ruby.background
                rubyElement.style.backgroundColor = defaultRubyStyle.ruby.backgroundColor
                rubyElement.style.color = defaultRubyStyle.ruby.color
                rubyElement.style.border = defaultRubyStyle.ruby.border
                rubyElement.style.textDecoration = defaultRubyStyle.ruby.textDecoration
                rubyElement.style.rubyPosition = defaultRubyStyle.ruby.rubyPosition

                rtElement.style.textDecoration = defaultRubyStyle.rt.textDecoration
                rtElement.style.backgroundColor = defaultRubyStyle.rt.backgroundColor
                rtElement.style.color = defaultRubyStyle.rt.color
                rtElement.style.display = defaultRubyStyle.rt.display
                rtElement.style.fontFamily = defaultRubyStyle.rt.fontFamily

                // hoverDiv.style={
                //     zIndex:99999999,
                //     position:"absolute",
                //     top:"15px",
                //     width:"auto",
                //     height:'auto',
                //     display: "inline-block",
                //     border: "1px solid black",
                // }

                console.log(textNode.textContent)
                const sentenceWithoutWord = textNode.textContent.split(wordObj.word)
                const fragment = new DocumentFragment()

                sentenceWithoutWord.forEach((sentence, i) => {
                    if (i === sentenceWithoutWord.length - 1) {
                        fragment.append(sentence)
                    } else {
                        fragment.append(sentence, renderNode.cloneNode(true))
                        // console.log(fragment)
                    }
                })


                const allWordSpan = fragment.querySelectorAll('.hooli-span-node')

                // wordSpan.addEventListener('mouseover',()=>{
                //     hoverDiv.textContent=wordObj.alias;
                //     wordSpan.appendChild(hoverDiv)
                //     console.log(wordObj.alias)
                //     wordSpan.addEventListener('mouseout',()=>{
                //         if(wordSpan.querySelector('.hover-div')){
                //             wordSpan.removeChild(hoverDiv)
                //         }                        
                //     })
                // })

                allWordSpan.forEach(wordSpan => {
                    wordSpan.addEventListener('click', () => {
                        hoverDiv.textContent = wordObj.context;
                        wordSpan.appendChild(hoverDiv)
                        document.addEventListener('click', (e) => {
                            const isClickInside = wordSpan.contains(e.target)
                            if (!isClickInside && wordSpan.querySelector('.hover-div')) {
                                wordSpan.removeChild(hoverDiv)
                            }
                        })
                    })
                })
                textNode.replaceWith(fragment);



                if (displayList) {
                    let theWordInDisplayList = displayList.find(wordObjInDisplay => wordObjInDisplay.id === wordObj.id)
                    if (!theWordInDisplayList) {
                        displayList.push({ ...wordObj, countInCurrentPage: 1, currentContext: textNode.textContent })
                        if (setting.wordListDisplay) {
                            showWordList()
                        }
                    }
                    // else {
                    //     theWordInDisplayList.countInCurrentPage += 1
                    // }
                    // console.log(displayList[0].countInCurrentPage)

                }
            }

        }
    }

};
