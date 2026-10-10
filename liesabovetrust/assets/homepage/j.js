// @ts-check
window.addEventListener("load", () => {

    window.addEventListener("resize", () => setGridValueProperty())

    const tableOfEntries2 = document.getElementById("updates-entries")

    /** @param {number} unixtime @param {string} name @param {string | null} link  */
    function addUpdateEntry(name, unixtime, link = null) {
        let tableRow = document.createElement("tr")

        let first = document.createElement("td")
        let second = document.createElement("td")
        tableRow.appendChild(first)
        tableRow.appendChild(second)

        let updateName;
        if (link) {

            updateName = document.createElement("a")
            updateName.href = link
            updateName.target = "blank"

            let notif = document.createElement("span")
            notif.className = "symbol"
            notif.textContent = "!"
            first.appendChild(notif)
            
            if (!haveSeenUpdate(unixtime)){
                updateName.onclick = () => {
                    markSeenUpdate(unixtime)
                    notif.style.display = "none"
                }
            } else notif.style.display = "none"

        } else updateName = document.createElement("span")

        updateName.textContent = name
        first.appendChild(updateName)

        let date = document.createElement("span")
        date.textContent = getTimeSince(unixtime)
        date.title = getDate(unixtime)
        second.appendChild(date)

        tableOfEntries2?.appendChild(tableRow)

        /** @param {number} unixtime  */
        function haveSeenUpdate(unixtime) {
            let storage = localStorage.getItem("viewed_updates")
            if (storage && storage.split("|").includes(unixtime.toString())) return true
            return false
        }

        /** @param {number} unixtime  */
        function markSeenUpdate(unixtime) {
            let stor = localStorage.getItem("viewed_updates")
            if (stor) {
                let stories = new Set(stor.split("|"))
                stories.add(unixtime.toString())
                //@ts-ignore
                localStorage.setItem("viewed_updates", stories.values().join("|"))
            } else localStorage.setItem("viewed_updates", unixtime.toString())
        }
    }
    
    /** @param {number} unixtime  @returns {string} */
    function getTimeSince(unixtime) {
        let secondsSince = Date.now() / 1000 - unixtime

        const secondsInHours = 3600
        const hoursInDays = 24

        let hours = secondsSince / secondsInHours
        if (hours < 23.5) return hours.toFixed(1) + "h"
        let days = hours / hoursInDays
        if (days < 9.5) return days.toFixed(1) + "d"
        //@ts-ignore
        return getDate(unixtime).split(" / ").at(-1)
    }

    /** @param {number} unixtime  */
    function getDate(unixtime) {
        let time = new Date(unixtime * 1000)

        let strDay = time.getDate().toString()
        if (strDay.length === 1) strDay = "0" + strDay
        let strMonth = time.getMonth().toString()
        if (strMonth.length === 1) strMonth = "0" + strMonth
        let strYear = time.getFullYear().toString().slice(2)
        
        let strSeconds = time.getSeconds().toString()
        if (strSeconds.length === 1) strSeconds = "0" + strSeconds
        let strMinutes = time.getMinutes().toString()
        if (strMinutes.length === 1) strMinutes = "0" + strMinutes
        let strHours = time.getHours().toString()
        if (strHours.length === 1) strHours = "0" + strHours

        return strHours + ":" + strMinutes + ":" + strSeconds + " / " + 
            strDay + "." + strMonth + "." + strYear
    }

    function copyButton() {
        navigator.clipboard.writeText(
            `
    <a href="https://liesabovetrust.nekoweb.org" target="_blank">
        <img src="https://liesabovetrust.nekoweb.org/e/button.png" 
        alt="liesabovetrust.nekoweb.org" 
        style="image-rendering: crisp-edges">
    </a>`
        )

        alert("Copied the button")
    }
    document.getElementById("copy-button")?.addEventListener("click", () => copyButton())

    function yearsOld() {
        let yo = document.getElementById("years-old")

        if (yo) yo.textContent = (
            (Date.now() / 1000 - 1173092400) / 
            (3600 * 24 * 365.25)
        ).toFixed(2)
    }
    yearsOld()

    const gridElement2 = document.getElementById("de-big-wrappa")
    function setGridValueProperty() {
        if (!gridElement2) return
        
        let str = getComputedStyle(gridElement2).gridTemplateColumns
        let gridWidth = str.split("100px").length - 1

        gridElement2.style.setProperty("--grid-width", gridWidth.toString())
    }
    setGridValueProperty()

    function birdcage() {
    }

        
    async function nekowebApiQuirks() {
        let lastUpdate = "";
        let views = "";
        let followers = "";
        let status = -1;
        // try {
            for (let i = 0; i < 1; i++) { // Jump out when `break`
                let fet = await fetch("https://cors.io/?u=https://nekoweb.org/api/site/info/liesabovetrust.nekoweb.org")
                if (fet.status != 200) {
                    status = fet.status
                    console.warn(fet.statusText);
                    break
                }
                // console.log(await fet.json());
                /** @type {any} */
                let outerBody = await fet.json()
                if (outerBody.status != 200) {
                    status = outerBody.status
                    break
                }
                let body = await JSON.parse(outerBody.body)
                console.log(body);
                lastUpdate = getTimeSince(body.updated_at / 1000)
                views = body.views
                followers = body.followers
            }
        // } catch (error) {
        //     console.warn("Nekoweb api fetching error:");
        //     console.warn(error);
        // }
        if (!lastUpdate) lastUpdate = "!" + status.toString() + "!"
        if (!views) views = "!" + status.toString() + "!"
        if (!followers) followers = "!" + status.toString() + "!"
        let updated = document.getElementById("neko-updated")
        let follows = document.getElementById("neko-follows")
        let watches = document.getElementById("neko-watches")
        if (updated) updated.textContent = lastUpdate
        if (follows) follows.textContent = followers
        if (watches) watches.textContent = views
    }

    async function nekowebApiQuirks() {
        let lastUpdate = "!~!";
        let views = "!~!";
        let followers = "!~!";
        // let status = -1
        try {
            let fet = await fetch("https://nekoweb.org/api/site/info/liesabovetrust.nekoweb.org")
            if (fet.status != 200) {
                // status = fet.status
                console.warn(fet.statusText);
                return
            }
            /** @type {any} */
            let body = await fet.json()
            console.log(body);
            lastUpdate = getTimeSince(body.updated_at / 1000)
            views = body.views
            followers = body.followers
        } catch (error) {
            console.warn("Nekoweb api fetching error:");
            console.warn(error);
        }
        // if (!lastUpdate) lastUpdate = "!" + status.toString() + "!"
        // if (!views) views = "!" + status.toString() + "!"
        // if (!followers) followers = "!" + status.toString() + "!"
        let updated = document.getElementById("neko-updated")
        let follows = document.getElementById("neko-follows")
        let watches = document.getElementById("neko-watches")
        if (updated) updated.textContent = lastUpdate
        if (follows) follows.textContent = followers
        if (watches) watches.textContent = views
    }
    nekowebApiQuirks()

    //@ts-ignore
    import("{{ (resources.Get (`common/fetch_data.js`) | resources.Fingerprint `md5`).RelPermalink }}")
    .then(async (module) => {
        let body = await module.fetchEntries()
        /** @type {any[]} */
        let array = body.updateEntries
        array.sort((a, b) => b.unix - a.unix)
        for (let i = 0; i < Math.min(20, array.length); i++) {
            const entry = array[i];
            addUpdateEntry(
                entry.name,
                entry.unix,
                entry.link
            )
        }

    }).catch((err) => {
        console.error("Dynamic import failed:", err);
    });;
})