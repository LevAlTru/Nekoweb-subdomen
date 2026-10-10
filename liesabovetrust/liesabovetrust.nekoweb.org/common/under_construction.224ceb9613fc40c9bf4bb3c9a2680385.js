// @ts-check
/*
<script src="../common/under_construction.js"></script>
*/

window.addEventListener("load", () => {
    const constructionElementsString = '<div id="under-construction" style="height: 392px; width: 586px; background-image: url(../assets/under_construction.png); background-size:cover; image-rendering: crisp-edges; position: fixed; bottom: 50px; right: 50px;"></div>'
    const spanConstructionElementsString = '<span id="under-construction-clock" style="position: relative; left: 100px; top: 175px; color: #a9a96f; font-size: 36px; text-align: center;">55555</span>'

    const parser = new DOMParser()
    /** @type {Element} */
    // @ts-ignore
    const uc = parser.parseFromString(constructionElementsString, "text/html").body.firstElementChild
    /** @type {Element} */
    // @ts-ignore
    const clock = parser.parseFromString(spanConstructionElementsString, "text/html").body.firstElementChild

    uc.appendChild(clock)
    document.body.appendChild(uc)

    // const uc = document.getElementById("under-construction")
    // const clock = document.getElementById("under-construction-clock")

    let ticker = 0;

    /** @type {any[]} */
    let updateEntries = []

    let lastUpdate = -1;

    //@ts-ignore
    import("/common/fetch_data.485157e584bceb777dcc9c5dc32dcbef.js")
    .then(async (module) => {
        let body = await module.fetchEntries()
        for (let i = 0; i < body.lastUpdated.length; i++) {
            const entry = body.lastUpdated[i];
            updateEntries.push(entry)
        }
        lastUpdate = getTimeFromPath()
    }).catch((err) => {
        console.error("Dynamic import failed:", err);
    });

    function getTimeFromPath() {
        // console.log(window.location.pathname)
        let checkFor = window.location.pathname
        if (checkFor === "/" || checkFor === "/index.html") checkFor = "/newindex"
        for (const value of updateEntries) {
            // console.log(key, value);
            if (checkFor.includes(value.site)) {
                return value.unix
            }
        }
        return -1
    }

    function tick() {
        // @ts-ignore
        uc.style.bottom = Math.round(50 + Math.sin(ticker / 10) * 10) + "px";

        let now = Date.now() / 1000;

        if (lastUpdate < 0) {
            clock.innerHTML = "not logged"
        } else {
            clock.innerHTML = ((now - lastUpdate) / 60 / 60).toFixed(1) + "h"
        }
        ticker++
    }

    setInterval(tick, 100)
})