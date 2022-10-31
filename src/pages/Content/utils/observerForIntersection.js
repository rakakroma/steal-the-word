
// import { displayList, wordInPageList, showWordList } from "../components/infoSection";

// //IntersectionObserver オブジェクト（オブザーバー）を生成  
// export const observerForIntersection = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         const wordId = entry.target.wordId
//         if (entry.isIntersecting) {
//             displayList.push(entry.target.wordId)
//             //監視対象の要素（entry.target）の textContent を使ってメッセージを出力
//             // console.log(entry.target.wordId + 'が見えています');
//         } else {
//             const indexOfTheElement = displayList.indexOf(wordId)
//             displayList.splice(indexOfTheElement, 1)
//         }
//         // console.log(displayList)
//         // showWordList()
//     });
// });

// //要素を監視
// //   document.querySelectorAll('hooli-text').forEach(node=>{observer.observe(node)}
// //   )
