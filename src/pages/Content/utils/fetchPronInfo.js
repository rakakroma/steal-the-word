

let kanjiLearningLangs = ['ja','bopomofo','pinyin','nan-tw','hak-sixian', 'hak-hailu', 'hak-dabu', 'hak-raoping', 'hak-zhaoan', 'hak-nansixian']

// if kanji learning is only one language , once target word contains kanji, call API to get that 
//if = 2 && includes japanese, check if it is japanese, call its API to get it
//if > 2 && includes japanese, check if it is japanese, if so call API, otherwise show button


const moedictAPI = (word, lang) => {
    return `https://www.moedict.tw/${lang}/${word}.json`
}


const languageDetectionForPronSearch = async(targetWord, context)=>{


    const regexKanji = new RegExp(/\p{sc=Hani}/gu)
    const includesKanji = targetWord.match(regexKanji)

    if(includesKanji){
    if(context) {
    let contextLangs;
     await chrome.i18n.detectLanguage(context).then(result=>{
        if(result.languages.length > 0) contextLangs = result.languages
    })
    if(contextLangs.map(lang=>lang.language).includes('ja')) return 'ja'
    return 
    }

    let wordLangs;
     await chrome.i18n.detectLanguage(targetWord).then(result=>{
        if(result.languages.length > 0) wordLangs = result.languages
    })
    if(wordLangs.map(lang=>lang.language).includes('ja')) return 'ja'
    }
}



export const fetchPronInfo = async(targetWord, contextHere)=>{

    // const targetWord = this.newWord;
    let lang;
    // let lang = 'pinyin';

    let pronounceDataResult;
    
    if(kanjiLearningLangs.length === 1 ){
        lang = kanjiLearningLangs[0]
    }else{
        if(kanjiLearningLangs.includes('ja')){
    const langDetectionResult = await languageDetectionForPronSearch(targetWord, contextHere)
    lang = langDetectionResult
        }
    }

    let fetchingData = true

    setTimeout(()=>{
        fetchingData = false
    },3500)

    if(lang === 'ja'){
    let urlencoded = new URLSearchParams();
    urlencoded.append("app_id", "8732e9655ce0d9734507d59dc5f08c6243192ae556b82e233b8d7394b6517223");
    urlencoded.append("sentence", targetWord);
    urlencoded.append("output_type", "hiragana");
    

   pronounceDataResult = await fetch("https://labs.goo.ne.jp/api/hiragana", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: urlencoded,
      })
    .then(response => response.json())
    .then(result => {
        return result.converted
        // this._wordPronounce = result.converted
        // console.log('this._wordPronounce', this._wordPronounce)
    })
    .catch(error => {
        fetchingData = false
    });
}else if(lang === 'hak'){

    const allLearningHakDialects = kanjiLearningLangs.filter(lang=>lang.includes('hak'))

    const abbrPair = {
        'hak-sixian':'四',
         'hak-hailu':'海',
          'hak-dabu':'大',
           'hak-raoping':"平",
            'hak-zhaoan':'安',
             'hak-nan':'南'
    }

    pronounceDataResult = await fetch(moedictAPI(targetWord, 'h'))
    .then(response => response.json())
    .then(data => {
        console.log(data)
        const allGroupedProns = data.h.map(group=>group.p.split(" "))

        const matchedResult = allGroupedProns.map((groupedProns,index)=>{
            let listIndex =''

            if(allGroupedProns.length >1 ){ 
             listIndex = `(${index+1})`
            }
                return listIndex + groupedProns.filter(pron=> {
              return allLearningHakDialects.some(dialect => pron.includes(abbrPair[dialect]))
            }).join(', ').toString()
        
        }).join(', ').toString()
        if(matchedResult.length === 1 && allLearningHakDialects.length ===1) return matchedResult.slice(2)
        return matchedResult.replaceAll('⃞', '：')
    })
    .catch(err => console.error(err));

}else if(lang === 'nan-tw'){

    pronounceDataResult = await fetch(moedictAPI(targetWord, 't'))
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        const allProns = data.h.map(group=>group.T)

        const matchedResult = allProns.map((pron,index)=>{
            let listIndex =''
            if(allProns.length >1 ){ 
                listIndex = `(${index+1})`
            }
                return listIndex+pron
            }).join(', ').toString()
        
    return matchedResult
    })
    .catch(err => console.error(err));

}else if(lang === 'bopomofo' || lang === 'pinyin'){

    
    pronounceDataResult = await fetch(moedictAPI(targetWord, 'raw'))
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
        const allProns = data['heteronyms'].map(group=>group[lang])

        
        const matchedResult = allProns.map((pron,index)=>{
            let listIndex =''
            if(allProns.length >1 ){ 
                listIndex = `(${index+1})`
            }
                return listIndex+pron
            }).join(', ').toString()
        
    return matchedResult
    })
    .catch(err => console.error(err));
}
return pronounceDataResult


}