import * as cldrSegmentation from 'cldr-segmentation'

const clearHooliRtFromParagraph = (targetElement) => {
    let p = targetElement.textContent.trim()
    if (targetElement.querySelector('.hooli-span-node')) {
        const rubyAndRt = []
        targetElement.querySelectorAll('.hooli-span-node')
            .forEach(ele => {
                if (rubyAndRt.some(pair => pair[0] === ele.textContent)) return
                const rtText = ele.querySelector('rt').textContent
                rubyAndRt.push([ele.textContent, ele.textContent.replace(rtText, "")])
            })
        rubyAndRt.forEach(pair => {
            p = p.replace(pair[0], pair[1])
        })

    } return p
}

const joinTextAndRubyParagraph = (currentNode) => {
    const currentParagraphNodesArray = [currentNode]
    const checkRubySiblingNode = () => {

        const checkPrevNode = () => {
            const currentFirstNode = currentParagraphNodesArray[0]
            const previousNode = currentFirstNode.previousSibling;

            if (previousNode.nodeName === "RUBY" &&
                !currentParagraphNodesArray.includes(previousNode)) {
                currentParagraphNodesArray.unshift(previousNode)
                checkPrevNode(currentParagraphNodesArray[0])
                return
            }
            if (previousNode.nodeName === "#text" &&
                !currentParagraphNodesArray.includes(previousNode)) {
                currentParagraphNodesArray.unshift(previousNode)
                checkPrevNode(currentParagraphNodesArray[0])
                return
            }
            return
        }
        const checkNextNode = () => {
            const currentLastNode = currentParagraphNodesArray[currentParagraphNodesArray.length - 1]
            const nextNode = currentLastNode.nextSibling;

            if (nextNode.nodeName === "RUBY" &&
                !currentParagraphNodesArray.includes(nextNode)) {
                currentParagraphNodesArray.push(nextNode)
                checkNextNode(currentParagraphNodesArray[currentParagraphNodesArray.length - 1])
                return
            }
            if (nextNode.nodeName === "#text" &&
                !currentParagraphNodesArray.includes(nextNode)) {
                currentParagraphNodesArray.push(nextNode)
                checkNextNode(currentParagraphNodesArray[currentParagraphNodesArray.length - 1])
                return
            }
            return
        }
        checkPrevNode();
        checkNextNode();
        return
    }
    checkRubySiblingNode(currentNode)
    return currentParagraphNodesArray.reduce((accumulator, currentNode) => {
        return accumulator = accumulator + currentNode.textContent
    }, "")
}



export const getSelectedSentence = (selection) => {

    const currentNode = selection.anchorNode
    const selectedString = selection.toString()

    const paragraphFromNode = (element, parentCount) => {
        if (!parentCount) return element.textContent.trim()
        if (parentCount === 1) return clearHooliRtFromParagraph(element.parentElement)
        if (parentCount === 2) return clearHooliRtFromParagraph(element.parentElement.parentElement)
        return
    }
    const getChosenSentence = (paragraph) => {
        const supp = cldrSegmentation.suppressions.en;
        const splittedParagraph = cldrSegmentation.sentenceSplit(paragraph, supp)
        console.log(splittedParagraph)

        const getAdjacentText = (direction) => {
            let lastWordOffset;
            let firstWordOffset;
            if (selection.anchorOffset < selection.extentOffset) {
                firstWordOffset = selection.anchorOffset
                lastWordOffset = selection.extentOffset
            } else {
                firstWordOffset = selection.extentOffset
                lastWordOffset = selection.anchorOffset
            }

            const pastTextOffset = firstWordOffset > 5 ? firstWordOffset - 5 : 0
            const forwardTextOffset = currentNode.textContent.length > lastWordOffset + 5 ?
                lastWordOffset + 5 : currentNode.textContent.length
            if (direction === 'both') return currentNode.textContent.substring(pastTextOffset, forwardTextOffset)
            if (direction === 'past') return currentNode.textContent.substring(pastTextOffset, lastWordOffset)
            if (direction === 'forward') return currentNode.textContent.substring(firstWordOffset, forwardTextOffset)
            return
        }
        const firstSentenceIncludesString = (testString) => {
            const result = splittedParagraph.filter(sentence => sentence.includes(testString))
            if (result.length > 0) return result[0]
            return null
        }
        return firstSentenceIncludesString(getAdjacentText("both")) ||
            firstSentenceIncludesString(getAdjacentText("forward")) ||
            firstSentenceIncludesString(getAdjacentText("past")) ||
            firstSentenceIncludesString(paragraph) ||
            firstSentenceIncludesString(selectedString)
    }

    if (paragraphFromNode(currentNode).split(" ").length > 150) {
        return getChosenSentence(paragraphFromNode(currentNode))
    } else if (paragraphFromNode(currentNode).split(" ").length < 3 &&
        paragraphFromNode(currentNode).length > 500) {
        return getChosenSentence(paragraphFromNode(currentNode))
    } else if (paragraphFromNode(currentNode).length === paragraphFromNode(currentNode, 1).length &&
        paragraphFromNode(currentNode, 2).length < 5000
    ) {
        return getChosenSentence(paragraphFromNode(currentNode, 2))
    }
    else if (paragraphFromNode(currentNode, 1).length < 5000) {
        return getChosenSentence(paragraphFromNode(currentNode, 1))
    } else if (currentNode.textContent.length < 5000 && currentNode.parentElement.querySelector('ruby')) {
        const currentParagraph = joinTextAndRubyParagraph(currentNode)
        return getChosenSentence(currentParagraph)
    } else {
        return getChosenSentence(paragraphFromNode(currentNode))
    }
}