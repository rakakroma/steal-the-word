
export const setWordBlockPosition = (ref, blockEle) => {
    let type;
    if (ref.constructor.name === 'Range') {
        type = 'range'
    }
    if (ref.tagName === 'HOOLI-TEXT') {
        type = 'textEle'
    }
    const refClientRect = ref.getBoundingClientRect()
    let countLeftPos;
    if (type === 'textEle') countLeftPos = refClientRect.left + ref.offsetWidth / 2
    if (type === 'range') countLeftPos = refClientRect.left + refClientRect.width / 2
    let leftPos = 0

    const countBottomPos = -(window.scrollY + refClientRect.top)
    let useTopPos = refClientRect.top < 150 ? true : false
    // let bottomPos = countBottomPos

    if (countLeftPos > 190 && window.innerWidth - countLeftPos > 200) {
        leftPos = countLeftPos
    } else if (countLeftPos < 190) {
        leftPos = 190

    } else if (window.innerWidth - countLeftPos < 200) {
        leftPos = window.innerWidth - 200

    }

    const bodyComputedStyle = window.getComputedStyle(document.body)

    if (['absolute', 'relative'].includes(bodyComputedStyle.position)) {

        //some bug in 'absolute'
        blockEle.style.left = `${leftPos}px`

        if (!useTopPos) blockEle.style.bottom = `${parseFloat(bodyComputedStyle.height) + countBottomPos + 20}px`
        if (useTopPos) blockEle.style.top = `${window.scrollY + refClientRect.bottom}px`
    } else {
        blockEle.style.left = `${window.scrollX + leftPos}px`

        if (!useTopPos) blockEle.style.bottom = `${window.innerHeight - window.scrollY - ref.getBoundingClientRect().top + 2}px`
        if (useTopPos) blockEle.style.top = `${window.scrollY + refClientRect.bottom + 2}px`
    }


}