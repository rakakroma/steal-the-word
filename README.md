已知的 bug／技術限制，有解法歡迎 pull request 或 fork 出去作個新的：

1. 動態更新在部分網站（如 youtube）嚴重影響效能，在許多網站則完全不必要，目前在臉書和推特我個人覺得效能還正常，可以使用看看。
2. 目前沒有測試究竟詞庫裡多少字，瀏覽網頁多少元素會有感影響效能，若遇到卡頓請斟酌刪除或關閉，也可回報狀況作參考。
3. 若該例句包含已儲存的單字，自動儲存的例句可能比較容易不夠完整，而且會複製到該單字的註解/小字/rt。
4. 目前存檔全部存在使用者瀏覽器的 localStorage 裡面，因為這屬於暫存區，雖然正常使用大致上沒問題，但我也不能保證他會不會因為什麼理由而被瀏覽器刪掉，使用清除快取、歷史之類的工具時要小心，若在意詞庫務必定期備份。
5. 當使用者自訂 ruby 樣式的愈多，就愈容易跟網站的其他文字格格不入，但自訂的越少，也越容易被原有的設定影響，例如目前 iTaigi 裡面 ruby 字會變超大，我原本想用 shadow DOM 解決但還沒成功。
6. 這個擴充功能是直接對網頁作修改，所以不能保證不會有意想不到的差錯（如文字被刪除、隱藏、出現奇怪排版之類的），如果覺得怪怪的務必關閉後對照看看。
7. 我覺得最有用的通常是讀大部頭的 epub 或 pdf，但目前只支援讀 local 的 html。

提醒：
提醒 1：不要儲存拼字結構簡單，經常被包含在其他意思詞彙的詞，因為會配對到許多不相關的詞。

原因：

- 過度配對：這個問題在拼音文字系統上特別明顯。舉例來說，當將<code>an</code>存入詞彙時，不論是<code>an</code> apple 還是 r<code>an</code>ge 中的 an 都會被比對到，這是因為程式現在直接以全文的部分相符而非與個別詞彙的完全相符作為條件。這個作法的優點是，他很簡單，而且能夠配對到一些複數詞、動詞變化（+s、+ed）後的詞彙，又不需要引入詞庫或是其他分詞工具來辨識是否為同個詞。當然，若是存入構造簡單的詞彙時，就會有過度配對，難以使用的問題。這聽起來不太好，但是為了解決這個問題，我想得到的解法都會出現不少 bug，所以目前不打算處理，如果有解法歡迎使用 pull request。

  其他解法的問題：

  1. 若要以前後空格來作為是否獨立詞彙的辨認標準，透過正規表達或是直接以空格拆分(split)就可以做到，但是這需要先區分出有空格的文字系統和沒空格的文字系統，且有些文章的中文+英文不會留下空格。透過引入 package 或 API 來辨識文字為何種語言則會導致小眾語言無法處理的問題。若要將每句都用有幾個空格來辨識是否為具有空格的文字，則無法處理標題及大量使用的 span 等語法。
  2. 一種作法是，提供一個簡便標注筆記語言的工具給使用者，並且在不同網頁使用不同的配對模式，由於部分 html 的語言標籤不準確（尤其小語種），或是部分網站是具有多語言的，要求使用者都自己做出標注多少有些麻煩。
  3. 最好的方法應該是引入分詞系統，但要支援語言有限定，應該效能也會降低，所以暫時不考慮。

提醒 2：定期備份儲存清單，小心使用瀏覽器清理軟體。
原因：本擴充功能資料完全儲存在客戶端，沒有伺服器，沒有存在 chrome 的同步帳號裡面。唯一傳送資料出去是使用快速查詢讀音的 API 時，傳送該詞彙而已。所以當你在清理快取等資料，甚至解除安裝瀏覽器時，很有可能這個清單會消失。就算你都沒有做這些事，但瀏覽器內部空間並非適合儲存長期資料的地方，雖然正常使用大致上無礙，但我也不能確定哪些情況會導致資料消失。所以注重這些資料的人，建議要定期作備份。
