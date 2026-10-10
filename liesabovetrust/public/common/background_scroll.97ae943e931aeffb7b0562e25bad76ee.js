// @ts-check

/*

<link rel="stylesheet" href="../common/background.css">

- - - - - - - - - - - - - - - - - - - - - - - - - - - -

<div id="background"></div>
<script src="../common/background_scroll.js"></script>

*/

window.addEventListener('load', function () {
    const backgroundElement = document.getElementById("background")
    document.addEventListener("scroll", (event) => {
        setBackgroundElementScroll(backgroundElement)
    });
    setBackgroundElementScroll(backgroundElement)
})

/** @param {HTMLElement | null} backgroundElement */
function setBackgroundElementScroll(backgroundElement) {
    backgroundElement?.style.setProperty("--scroll", window.scrollY.toString())
}