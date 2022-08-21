//all text content in a facebook post
Array.from(document.getSelection()
    .anchorNode.parentElement.parentElement.parentElement.childNodes)
    .map(node => node.textContent)

//get author name:
// document.getSelection().anchorNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('h4').textContent
