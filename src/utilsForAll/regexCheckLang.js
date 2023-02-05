//ISO 15924 Codes for the representation of names of scripts
//http://www.unicode.org/iso15924/iso15924-num.html

//there is a wiki page:"Scriptio continua" talking about this:

export const isLangsNotUseSpaceRegex = new RegExp(
  /\p{sc=Hani}|\p{sc=Hira}|\p{sc=Kana}|\p{sc=Hang}|\p{sc=Java}|\p{sc=Thai}/,
  'um'
);
