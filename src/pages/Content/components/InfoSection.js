import interact from 'interactjs'
// import './customElements/HolliText'

export const infoSection = document.createElement('section')
infoSection.id = 'hooriruby-info-div'

const shadowInfoSection = infoSection.attachShadow({ mode: "open" })
shadowInfoSection.innerHTML = `
<style>
:host{
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

}

ol{
  padding:0;
  list-style-type:none;
}

li{
    font-size:15px;
}

#holli-control-bar{
    min-height:15px;
    max-height:15px;
    width:100%;
    background-color:grey;
}
#holli-control-bar.active{
    cursor: move;
    user-select: none;  
}
span{
    color:#1a4d3b;
    margin-left:8px;
}

.holli-current-context-div{
  color: #393d36;
}

.hooliruby-pin-button{
  display:none;
}

.hooliruby-words-block:hover .hooliruby-pin-button{
  display:inline-block;
}

h3,h6{
  display:inline-block;
  margin-top:0;
  margin-bottom:0;
  margin-left:5px;

}
a {
  color:inherit;
}

#scroll-navigation-bar{
  display:flex;
}

</style>
`

export const countList = document.createElement('ol')
const controlBar = document.createElement('div')
controlBar.id = 'holli-control-bar'
controlBar.draggable = true

const testLanguageDetectInput = document.createElement('input')
const submitButton = document.createElement('button')
submitButton.textContent = '🤔'
const container  = document.createElement('div')
submitButton.addEventListener('click', ()=>{
  const text = testLanguageDetectInput.value
  if(text){
  let detectingLanguages = chrome.i18n.detectLanguage(text)
  detectingLanguages.then(result=>{
    console.log('text:',text)
    console.log('isReliable:', result.isReliable)
    console.log('langs:', result.languages.map(lang=> `${lang.language} ${lang.percentage}%`))
  })
  }else{
    console.log('no text!')
  }
})

container.appendChild(testLanguageDetectInput)
container.appendChild(submitButton)


shadowInfoSection.appendChild(controlBar)

//
shadowInfoSection.appendChild(container)
shadowInfoSection.appendChild(countList)

export const displayList = []
export const wordInPageList = []
let showingMode

const modeButton = document.createElement('button')
modeButton.textContent = '😅'
modeButton.addEventListener('click', () => {
  if (showingMode === 'displaying') {
    showingMode = 'inPage'
    showWordList()
    return
  }
  showingMode = 'displaying'
  showWordList()

})
controlBar.appendChild(modeButton)

const clearButton = document.createElement('button')
clearButton.textContent = 'clear'
clearButton.addEventListener('click', () => {
  wordInPageList.length = 0
  showWordList()
}
)
controlBar.appendChild(clearButton)


export const showWordList = () => {
  let mode = showingMode || 'inPage'
  console.log('showWordList')

  countList.textContent = ''
  if (wordInPageList.length > 0) {
    document.body.appendChild(infoSection)
    const topBar = shadowInfoSection.querySelector('#holli-control-bar')


    const position = { x: 0, y: 0 }
    interact(topBar)
      .draggable({
        // modifiers: [
        //     interact.modifiers.restrict({
        //       restriction: 'parent',
        //       endOnly: true
        //     })
        //   ],            
        listeners: {
          //   start (event) {
          //     console.log(event.type, event.target)
          //   },
          move(event) {
            // console.log(event)
            position.x += event.dx
            position.y += event.dy

            infoSection.style.transform =
              `translate(${position.x}px, ${position.y}px)`
          },
        }
      })

    interact(infoSection)
      .resizable({
        edges: { bottom: true },
        listeners: {
          move: function (event) {
            // console.log(event.target.dataset, event.rect)
            let { x, y } = event.target.dataset
            x = (parseFloat(x) || 0) + event.deltaRect.left
            y = (parseFloat(y) || 0) + event.deltaRect.top

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              //   transform: `translate(${x}px, ${y}px)`
            })

            Object.assign(event.target.dataset, { x, y })
          }
        }
      })

    const displayingList = Array.from(new Set(displayList)).map(wordId => {
      return wordInPageList.find(wordObj => wordObj.id === wordId)
    })

    if (mode === 'displaying') {
      displayingList.forEach(wordObj => {
        const countListItem = document.createElement('li')
        const wordH3 = document.createElement('h3')
        const aliasH6 = document.createElement('h6')
        countListItem.className = 'hooliruby-words-block'
        wordH3.textContent = wordObj.word
        aliasH6.textContent = wordObj.pronounce || wordObj.definitions[0].aliases[0]
        countListItem.appendChild(wordH3)
        countListItem.appendChild(aliasH6)
        countList.appendChild(countListItem)
      })
    } else if (mode === 'inPage') {
      wordInPageList.forEach(wordObj => {
        const countListItem = document.createElement('li')
        const wordH3 = document.createElement('h3')
        const aliasH6 = document.createElement('h6')
        const wordTotalCount = document.createElement('h6')
        wordTotalCount.textContent = `${wordObj.countInCurrentPage}`

        // wordH3.addEventListener('click',()=>{
        //   const lastElement = document.querySelector(`#h-${wordObj.id}-${wordObj.countInCurrentPage}`)
        //   if(lastElement)  lastElement.scrollIntoView({ behavior: 'smooth' });

        // })
        wordTotalCount.addEventListener('click',()=>{
          startScrollToElement(wordObj)
        })
        countListItem.className = 'hooliruby-words-block'
        wordH3.textContent = wordObj.word
        aliasH6.textContent = wordObj.pronounce || wordObj.definitions[0].aliases[0]
        // anchor.appendChild(wordH3)
        countListItem.appendChild(wordTotalCount)
        countListItem.appendChild(wordH3)
        countListItem.appendChild(aliasH6)
        countList.appendChild(countListItem)
      })
    }

  }
}

const startScrollToElement = (wordObj)=>{

  const scrollNavigationBar = document.createElement('div')
const prevButton = document.createElement('button')
const nextButton = document.createElement('button')
const targetWord = document.createElement('h5')
const closeScrollNavigationBar = document.createElement('button')

const currentTarget = document.createElement('h5')
currentTarget.textContent = `${wordObj.countInCurrentPage}`
scrollNavigationBar.id = 'scroll-navigation-bar'
prevButton.textContent = '⬆'
nextButton.textContent = '⬇'
targetWord.textContent = wordObj.word
closeScrollNavigationBar.textContent = 'X'

scrollNavigationBar.append(closeScrollNavigationBar, targetWord, prevButton, nextButton)
shadowInfoSection.appendChild(scrollNavigationBar)
}

