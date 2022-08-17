
const removeStringPunctuation = (str) => {
    return str.replace(/[^\p{L}\s]/gu, "")
}
const removeStringSpace = (str) => {
    return str.replace(/\s+/gm, "")
}
// 啲喺咗嚟係睇嘅揾佢噉哋啱冚唪唥

//[abeghijklmnopstu]
//[áàâǎāéèêěēíìîǐīóòôǒōőúùûǔūűḿńǹň]

//hakka[abcdefghiklmnoprstuvyz]
//a-z - jqwx
//cdfrvyz


const regexSmallDash = new RegExp(/-/g)
const regexTaiwaneseRomajiWithTones = new RegExp(/[áàâǎāéèêěēíìîǐīóòôǒōőúùûǔūűḿńǹň]/g)
const regexTaiwaneseSpacingModifier = new RegExp(/[aeioumn](?=[\u0300\u0302\u0304\u030c\u030b\u030d])/gu)

// const regexTaiwaneseSpacingModifier = new RegExp(/m(?=[\u0300\u0302\u0304\u030c\u030b\u030d])|n(?=[\u0300\u0302\u0304\u030b\u030d])|[aeiou](?=\u030d)|[aie](?=\u030b)/gu)
const regexBopoMofoSpacingModifier = new RegExp(/[ˇˊˉˋ˙˪˫]/g)

export const checkLocalLanguagePossible = (str) => {
    return str.match(regexTaiwaneseRomajiWithTones)?.length || 0 +
        str.match(regexTaiwaneseSpacingModifier)?.length || 0 +
        str.match(regexBopoMofoSpacingModifier)?.length || 0
}

export const checkStringLanguage = (str) => {

    const regexTaiwaneseRomaji = new RegExp(/[abeghijklmnopstu]/g)
    const regexHakkaRomaji = new RegExp(/[abcdefghiklmnoprstuvyz]/g)

    const lowerCaseString = str.toLowerCase()

    const arrayOfEachCharacter = removeStringSpace(removeStringPunctuation(lowerCaseString)).split("")
    const regexEnglishAlphabet = new RegExp(/[a-z]/g)
    const regexHan = new RegExp(/\p{sc=Hani}/gu)
    const regexKana = new RegExp(/\p{sc=Hira}|\p{sc=Kana}/gu)
    const regexHangul = new RegExp(/\p{sc=Hang}/gu)

    const localLanguageClassification = () => {
        let modifiedString = lowerCaseString
        const localLanguageScore = {
            dash: 0,
            taiwaneseTone: 0,
            taiwaneseRomaji: 0,
            bopomofoTone: 0,
            hakkaRomaji: 0,
            allRomaji: 0,
            hanji: 0
        }

        if (modifiedString.match(regexEnglishAlphabet)) {

            localLanguageScore.dash += modifiedString.match(regexSmallDash)?.length || 0
            localLanguageScore.hanji += modifiedString.match(regexHan)?.length || 0
            localLanguageScore.taiwaneseTone += (modifiedString.match(regexTaiwaneseSpacingModifier)?.length * 2) || 0
            modifiedString = modifiedString.replace(regexTaiwaneseSpacingModifier, "")
            localLanguageScore.taiwaneseTone += modifiedString.match(regexTaiwaneseRomajiWithTones)?.length || 0
            modifiedString = modifiedString.replace(regexTaiwaneseRomajiWithTones, "")
            localLanguageScore.bopomofoTone += modifiedString.match(regexBopoMofoSpacingModifier)?.length || 0
            localLanguageScore.taiwaneseRomaji += modifiedString.match(regexTaiwaneseRomaji)?.length || 0
            localLanguageScore.hakkaRomaji += modifiedString.match(regexHakkaRomaji)?.length || 0
            localLanguageScore.allRomaji += modifiedString.match(regexEnglishAlphabet).length
        }
        return localLanguageScore
    }

    const { dash, taiwaneseTone, taiwaneseRomaji, bopomofoTone,
        hakkaRomaji, allRomaji, hanji } = localLanguageClassification()



    const languageClassification = arrayOfEachCharacter.reduce((acc, currAlphabet) => {
        regexEnglishAlphabet.lastIndex = 0
        regexKana.lastIndex = 0
        regexHan.lastIndex = 0
        regexHangul.lastIndex = 0

        if (regexEnglishAlphabet.test(currAlphabet)) {
            acc.english = acc.english + 1 || 1
            return acc
        }
        if (regexKana.test(currAlphabet)) {
            acc.kana = acc.kana + 1 || 1
            return acc
        }
        if (regexHan.test(currAlphabet)) {
            acc.han = acc.han + 1 || 1
            return acc
        }
        if (regexHangul.test(currAlphabet)) {
            acc.hangul = acc.hangul + 1 || 1
            return acc
        }

        return acc
    }, {})



    if (taiwaneseTone && dash &&
        (dash + taiwaneseTone) / arrayOfEachCharacter.length > 0.2 &&
        (allRomaji - taiwaneseRomaji) / arrayOfEachCharacter.length < 0.05 &&
        hanji / arrayOfEachCharacter.length < 0.2) return 'taiwanese' //'taiwaneseRomaji'
    if (dash && taiwaneseTone && hanji / arrayOfEachCharacter.length > 0.3) return 'taiwanese' //'taiwaneseHanjiRomaji'
    if (bopomofoTone && (bopomofoTone + hakkaRomaji) / arrayOfEachCharacter.length > 0.6) return 'hakka' //'hakkaRomajiPinyin'
    if (bopomofoTone && hakkaRomaji && hakkaRomaji === allRomaji && hanji / arrayOfEachCharacter.length > 0.4) return "hakka" // 'hakkaHanjiRomaji'
    if (languageClassification.english / arrayOfEachCharacter.length > 0.8) return 'english'
    if (languageClassification.hangul / arrayOfEachCharacter.length > 0.4) return "korean"
    if (languageClassification.kana / arrayOfEachCharacter.length > 0.1) return 'japanese'
    if (languageClassification.han / arrayOfEachCharacter.length > 0.4) return 'chinese'
    return null
}