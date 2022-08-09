
export const joinTextAndRubyParagraph = (currentNode) => {
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