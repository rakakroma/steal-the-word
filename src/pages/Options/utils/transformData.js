

// export const dataTransform = (wordList) => {
//     const formattedList = wordList.map(wordObj => {
//         const result = { ...wordObj }
//         result.definitionGroups = [{
//             aliases: [wordObj.alias],
//             definitionId: "0"
//         }
//         ]
//         result.contextInfos = [{
//             context: wordObj.context,
//             date: wordObj.date,
//             url: wordObj.url,
//             pageTitle: wordObj.pageTitle,
//             definitionRef: '0',
//             phrase: wordObj.phrase || null
//         }]
//         delete result.alias
//         delete result.context
//         delete result.date
//         delete result.url
//         delete result.pageTitle
//         delete result.meaning
//         delete result.domain
//         delete result.phrase
//         result.definitionCount = 1
//         if (result.editedWordObj) delete result.editedWordObj
//         return result
//     }
//     )
//     return formattedList
// }

// export const getDomain = (url) => {
//     const domain = url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
//     return domain
// }





export const pagesWords = (contexts) => {
    const allPages = [...new Set(contexts.map(contextObj => contextObj.url))]
    return allPages.map(pageLink => {
        const page = { url: pageLink }
        const wordsInPage = contexts.reduce((acc, currentValue) => {
            if (currentValue.url === pageLink) return acc.concat(currentValue)
            return acc
        }, []
        )

        page.words = wordsInPage.sort((a, b) => {
            return b.date - a.date
        })
        return page
    })

}
//not sure if its necessary
// export const newPageWords = pagesWords.sort((a, b) => getLatestDateInContextInfos(b.words[0], b.url) - getLatestDateInContextInfos(a.words[0], a.url))

// console.log(newPageWords)


const customMatchUrls = ['developer.mozilla.org/ja']

// const allDomains = [...new Set(pagesWords.map(page => getDomain(page.url)))]


export const domainPageWords = (words) => pagesWords(words).reduce((acc, curr) => {
    const matchedCustomUrl = customMatchUrls.find(matchPart => (curr.url.includes(matchPart)))
    if (matchedCustomUrl) {
        if (acc.find(pagesAndMatchRule => pagesAndMatchRule[0] === matchedCustomUrl)) {
            return acc.map(pagesAndMatchRule => {
                if (pagesAndMatchRule[0] === matchedCustomUrl) pagesAndMatchRule[1].push(curr)
                return pagesAndMatchRule
            })
        } else {
            acc.push([matchedCustomUrl, [curr]])
            return acc
        }
    } else {
        if (acc.find(pagesAndMatchRule => pagesAndMatchRule[0] === new URL(curr.url).hostname)) {
            return acc.map(pagesAndMatchRule => {
                if (pagesAndMatchRule[0] === new URL(curr.url).hostname) pagesAndMatchRule[1].push(curr)
                return pagesAndMatchRule
            })
        } else {
            acc.push([new URL(curr.url).hostname, [curr]])
            return acc
        }
    }
}, [])

// export const getMatchedContextInfos = (wordObj, targetUrl) => wordObj.contextInfos.filter(contextInfo => contextInfo.url === targetUrl)


// export const getAllPhrasesInThisContext = (wordObj, targetUrl) => {
//     const allPhrases = getMatchedContextInfos(wordObj, targetUrl).reduce((acc, curr) => {
//         if (curr.phrase) { acc.push(curr.phrase) }
//         return acc
//     }, [])
//     return allPhrases.length > 0 ? allPhrases : null
// }


