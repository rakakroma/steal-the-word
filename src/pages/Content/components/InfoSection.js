import interact from 'interactjs'


export const infoSection = document.createElement('section')
infoSection.id = 'hooriruby-info-div'

const shadowInfoSection = infoSection.attachShadow({ mode: "open" })
shadowInfoSection.innerHTML = `
<style>



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


</style>
`

export const countList = document.createElement('ol')
const controlBar = document.createElement('div')
controlBar.id = 'holli-control-bar'
controlBar.draggable=true

// function onDrag({movementX, movementY}){
//     let getStyle = window.getComputedStyle(infoSection);
//     let leftVal = parseInt(getStyle.left);
//     let topVal = parseInt(getStyle.top);
//     console.log(leftVal, topVal)
//     infoSection.style.left = leftVal>0?`${leftVal + movementX}px`:"0px";
//     infoSection.style.top = topVal>0?`${topVal + movementY}px`:"0px";
//   }




shadowInfoSection.appendChild(controlBar)
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
        const topBar = shadowInfoSection.querySelector('#holli-control-bar')

        // topBar.addEventListener('dragstart',()=>{
        //     console.log("dragstart")
        //     topBar.classList.add('active')
        //     topBar.addEventListener('mousemove', onDrag)
        //   })
        //   document.addEventListener('mouseup',()=>{
        //     console.log("mouseup")
        //     topBar.classList.remove('active')
        //     topBar.removeEventListener('mousemove', onDrag)
        //   })
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
              move (event) {
                console.log(event)
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
                console.log(event.target.dataset, event.rect)
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
        

        displayList.forEach(wordObj => {
            const countListItem = document.createElement('li')
            const aliasSpan = document.createElement('span')
            // const currentContextDiv = document.createElement('div')
            // currentContextDiv.textContent = wordObj.currentContext
            // currentContextDiv.className = 'holli-current-context-div'

            countListItem.className = 'hooliruby-words-block'
            countListItem.textContent = wordObj.word
            aliasSpan.textContent=wordObj.alias
            countListItem.appendChild(aliasSpan)
            countList.appendChild(countListItem)
            // countList.appendChild(currentContextDiv)
        })
    }
}
