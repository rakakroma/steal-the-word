const createForm = document.createElement('form')
createForm.id = 'hooliruby-createform'
createForm.classList.add('hooliruby-create', 'hide-create')
const vocabularyInput = document.createElement('input')
vocabularyInput.id = 'hooliruby-vocabulary-input'
vocabularyInput.classList.add('hooliruby-create', 'hide-create')
vocabularyInput.name = 'vocabulary'
vocabularyInput.placeholder = '單字／単語／單詞／vocabulary'
const pronounceInput = document.createElement('input')
pronounceInput.id = 'hooliruby-pronounce-input'
pronounceInput.classList.add('hooliruby-create', 'hide-create')
pronounceInput.name = 'pronounce'
pronounceInput.placeholder = '拼音／注音／振り仮名／prnounciation'
const meaningInput = document.createElement('input')
meaningInput.id = 'hooliruby-meaning-input'
meaningInput.classList.add('hooliruby-create', 'hide-create')
meaningInput.name = 'meaning'
meaningInput.placeholder = '詞義／meaning／意味'
const contextDiv = document.createElement('div')
contextDiv.classList.add('hooliruby-create', 'hide-create')
contextDiv.contentEditable = 'true'
contextDiv.id = 'hooliruby-context-div'
const submitButton = document.createElement('button')
submitButton.classList.add('hooliruby-create', 'hide-create')
submitButton.type = 'submit'
submitButton.textContent = '送'

const sizeControlButton = document.createElement('button')
sizeControlButton.id = 'hooliruby-size-control-btn'
sizeControlButton.textContent = '🔶'
sizeControlButton.classList.add('hooliruby-create', 'hide-create')
sizeControlButton.setAttribute('type', 'button')


const searchTaiwaneseButton = document.createElement('button')
searchTaiwaneseButton.id = 'hooliruby-taiwanese-search-button'
searchTaiwaneseButton.textContent = '台'
searchTaiwaneseButton.classList.add('hooliruby-create', 'hide-create')

const searchHakkaButton = document.createElement('button')
searchHakkaButton.id = 'hooliruby-hakka-search-button'
searchHakkaButton.textContent = '客'
searchHakkaButton.classList.add('hooliruby-create', 'hide-create')


// const moedictTaiwaneseAPI = (word) => {
//     return `https://www.moedict.tw/t/${word}.json`
// }

//moedict API:
//Taiwanese: t
// Hakka: h
//traditional Chinese: a

const moedictAPI = (word, lang) => {
    return `https://www.moedict.tw/${lang}/${word}.json`
}
searchTaiwaneseButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (vocabularyInput.value) {
        fetch(moedictAPI(vocabularyInput.value, 't'))
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                pronounceInput.value = data.h[0].T
            })
            .catch(err => console.error(err));

    } else {
        console.log('請輸入詞彙');
    }
})

searchHakkaButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (vocabularyInput.value) {
        fetch(moedictAPI(vocabularyInput.value, 'h'))
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                pronounceInput.value = data.h[0].p.split(" ")[0].slice(2)
            })
            .catch(err => console.error(err));

    } else {
        console.log('請輸入詞彙');
    }
})

createForm.appendChild(sizeControlButton)
createForm.appendChild(vocabularyInput)
createForm.appendChild(pronounceInput)
createForm.appendChild(meaningInput)
// createForm.appendChild(contextInput)
createForm.appendChild(contextDiv)
// createForm.appendChild(searchTaiwaneseButton)
createForm.appendChild(submitButton)

// app.appendChild(createForm)
// app.appendChild(divInApp)

const languageDiv = document.createElement('div')
languageDiv.id = 'hoolirubi-language-div'
languageDiv.appendChild(searchHakkaButton)
languageDiv.appendChild(searchTaiwaneseButton)


createForm.querySelectorAll('div.hooliruby-create, input.hooliruby-create').forEach(ele => {
    ele.addEventListener('keyup', (e) => e.stopPropagation());
    ele.addEventListener('keydown', (e) => e.stopPropagation())
})


export {
    languageDiv,
    createForm,
    vocabularyInput,
    pronounceInput,
    meaningInput,
    contextDiv,
    searchHakkaButton,
    searchTaiwaneseButton,
    submitButton,
    sizeControlButton
}