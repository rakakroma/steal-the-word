import React from "react"

export const Settings = ({ handleExport, handleImport }) => {

    return <div>
        {/* <h2>設定</h2>
        <form>
            <h4>ruby背景顏色</h4>
            <input type='color' />
            <h4>使用方式</h4>
            <p>⚠️不少網站（如Yahoo!ニュース）及Edge瀏覽器在選取文字後會出現功能鍵（Edge可從設定中關閉），
                與本功能觸發機制相似，若一併使用會導致畫面複雜，
                較容易誤觸及需按兩次（Edge）才能生效。</p>
            <input type='checkbox' name="show-button-after-selection" id="show-button-after-direction" />
            <label htmlFor="show-button-after-selection">選取文字後自動出現按鈕</label>
            <input type='checkbox' name="context-menu-button" id="context-menu-button" />
            <label htmlFor="context-menu-button">選取文字後右鍵選單傳入編輯框</label>
            <input type='checkbox' name="show-button-with-hotkey" id="show-button-with-hotkey" />
            <label htmlFor="show-button-with-hotkey">選取後使用熱鍵(hotkey)傳入編輯框</label>


            <h4>讀音快速查詢鍵</h4>
            <input type='checkbox' name='taiwanese' id='taiwanese' />
            <label htmlFor="taiwanese">台語</label>
            <br />
            <span>客語</span>
            <input type='checkbox' name='sixian' id='sixian' />
            <label htmlFor="sixian">四縣</label>
            <input type='checkbox' name='hailu' id='hailu' />
            <label htmlFor="hailu">海陸</label>
            <input type='checkbox' name='dapu' id='dapu' />
            <label htmlFor="dapu">大埔</label>
            <input type='checkbox' name='raoping' id='raoping' />
            <label htmlFor="raoping">饒平</label>
            <button>確定</button>
        </form> */}
        {/* 
        <h4>匯入與匯出</h4>
        <form id='upload' onSubmit={handleImport}>
            <label htmlFor="file">上傳資料（json）</label>
            <input type='file' id='file' accept='.json' />
            <button>匯入</button>
        </form>
        <div>注意：匯入資料將取代原本清單</div>
        <a href={handleExport('href')} download={handleExport('download')}>下載單字清單</a> */}
    </div>
}