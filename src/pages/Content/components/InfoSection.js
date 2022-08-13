
export const infoSection = document.createElement('section')
infoSection.id = 'hooriruby-info-div'

const shadowInfoSection = infoSection.attachShadow({ mode: "open" })
shadowInfoSection.innerHTML = `
<style>
:host{
    all: initial;
    background-color:grey;
    width: 200px;
    height: 200px;
    color:green;
    position: fixed;
    top: 50px;
    right: 20px;
    z-index: 999999999999999999;  
    overflow-y: overlay
}
::-webkit-scrollbar-track {
    background: grey;
  }

li{
    font-size:15px;
    color:white;
}

</style>
`

export const countList = document.createElement('ol')

// const renderInfoSectionButton = document.createElement('button')
// renderInfoSectionButton.textContent = '重整'


// shadowInfoSection.appendChild(renderInfoSectionButton)
shadowInfoSection.appendChild(countList)

export const displayList = []


export const showWordList = () => {
    countList.textContent = ''
    if (displayList.length > 0) {
        document.body.appendChild(infoSection)
        // infoSection.shadowRoot.querySelector('button')
        // .addEventListener('click',()=>{
        //     showWordList()
        // })
        displayList.forEach(wordObj => {
            const countListItem = document.createElement('li')
            countListItem.className = 'hooliruby-words-block'
            countListItem.textContent = `${wordObj.word} ${wordObj.alias}`
            countList.appendChild(countListItem)
        })
    }
}
