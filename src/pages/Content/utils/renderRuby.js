import DOMPurify from 'dompurify';

export const renderRuby = (doc, list) => {

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

        for (let wordObj of list) {
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
                const renderNode = doc.createElement('span');
                renderNode.className = 'hooli-textnode';
                renderNode.innerHTML = textNode.textContent.replaceAll(wordObj.word, `<ruby>${DOMPurify.sanitize(wordObj.word)}<rt>${DOMPurify.sanitize(wordObj.alias)}</rt></ruby>`);
                textNode.replaceWith(renderNode);
                console.log('hi');
            }

        }
    }

};
