
!function () {
    setInterval(make_subtitles_selectable, 250);
    function make_subtitles_selectable() {
        elem = document.querySelector("div.caption-window");
        if (elem != null) {
            elem.addEventListener("mousedown", function (event) {
                event.stopPropagation();
            }, true);
            elem.setAttribute("draggable", "false");
            elem.style.userSelect = "text";
            elem.style.cursor = "text";
            elem.setAttribute("selectable", "true");
        }
        elem = document.querySelector("span.ytp-caption-segment:not([selectable='true']");
        if (elem != null) {
            elem.style.userSelect = "text";
            elem.style.cursor = "text";
            elem.setAttribute("selectable", "true");
        }
        elem = document.querySelector("#caption-window-1:not([selectable='true']");
        if (elem != null) {
            elem.addEventListener("mousedown", function (event) {
                event.stopPropagation();
            }, true);
            elem.setAttribute("selectable", "true");
            elem.setAttribute("draggable", "false");
        }
    }
}()

    //custom youtube subtitle style
    - webkit - text - stroke: 0.3px #000000
font - weight: 900