// @ts-check

window.addEventListener("load", () => {

    /** @type {Element} */
    // @ts-ignore
    const timerContainer = document.getElementById("timers")
    /** @type {Element} */
    // @ts-ignore
    const expiredTimerContainer = document.getElementById("timers-gone-bad")
    /** @type {Element} */
    // @ts-ignore
    const clockContainer = document.getElementById("clocks")

    class TimeScale {
        /** 
         * @param {number} milliseconds 
         * @param {string} name
         * @param {number} maxUnits 
         * @param {number} numbersAfterDecimal
         * @param {number} thickness  */
        constructor(name, milliseconds, maxUnits, numbersAfterDecimal, thickness) {
            this.milliseconds = milliseconds
            this.name = name
            this.maxUnits = maxUnits
            this.numbersAfterDecimal = numbersAfterDecimal
            this.thickness = thickness
        }

        /** @param {number} milliseconds  */
        millisecondsToThisTimeScale(milliseconds) {
            return milliseconds / this.milliseconds
        }
    }

    const millisecondsInSecond = 1000
    const secoundsInMinute = 60
    const minutesInHour = 60
    const hoursInDay = 24
    const daysInMonth = 365.25 / 12
    const monthsInYear = 12

    /** @type {TimeScale[]} */
    const timeScales = []
    timeScales.push(new TimeScale(
        "Years", 
        monthsInYear * daysInMonth * hoursInDay * minutesInHour * 
            secoundsInMinute * millisecondsInSecond, 
        1,
        7,
        20
    ))
    timeScales.push(new TimeScale(
        "Months", 
        daysInMonth * hoursInDay * minutesInHour * secoundsInMinute * 
            millisecondsInSecond, 
        monthsInYear,
        6,
        20
    ))
    timeScales.push(new TimeScale(
        "Days",
        hoursInDay * minutesInHour * secoundsInMinute * millisecondsInSecond, 
        daysInMonth,
        5,
        14
    ))
    timeScales.push(new TimeScale(
        "Hours", 
        minutesInHour * secoundsInMinute * millisecondsInSecond, 
        hoursInDay,
        4,
        10
    ))
    timeScales.push(new TimeScale(
        "Minutes", 
        secoundsInMinute * millisecondsInSecond, 
        minutesInHour,
        2,
        7
    ))
    timeScales.push(new TimeScale(
        "Seconds", 
        millisecondsInSecond, 
        secoundsInMinute,
        1,
        5
    ))
    const unknownTimeScale = new TimeScale(
        "Unknown",
        1,
        1,
        1,
        10
    )

    /** @param {number} milliseconds @returns {TimeScale} */
    function getApropriateTimeScale(milliseconds) {
        for (let i = 0; i < timeScales.length; i++) {
            const scale = timeScales[i];
            
            if (Math.abs(milliseconds) / scale.milliseconds > 1)
                return scale
        }
        // @ts-ignore
        return timeScales.at(-1)
    }

    /** @param {number} desc @param {number} now */
    function getTimeScaleAndTime(desc, now) {
        if (desc < 0) return {scale: unknownTimeScale, time: "1"}
        let milliseconds = desc - now
        let timeScale = getApropriateTimeScale(milliseconds)
        return { scale: timeScale, time: timeScale.millisecondsToThisTimeScale(milliseconds)
            .toFixed(timeScale.numbersAfterDecimal) }
    }

    var timers = document.querySelectorAll('.clock')

    /** 
     * @param {number} unixtime 
     * @param {string} color 
     * @param {string} desc 
     * @param {string} title
     * @param {boolean} timer 
     * @param {string?} link */
    function createCard(title, desc, unixtime, color, timer, link) {
        let card;
        if (link) {
            card = document.createElement("a")
            card.classList.add("no-deco")
            card.href = link
            card.target = "blank"
        }
        else card = document.createElement("div")
        card.classList.add("card", "frame")

        let clock = document.createElement("div")
        clock.classList.add("clock")
        if (timer) clock.classList.add("timer")
        clock.classList.add("font-jet")
        clock.dataset.unixtime = unixtime.toString()
        clock.style.setProperty("--timer-color", color)
        clock.style.setProperty("--timer-fill-color", "none")
        clock.style.setProperty("--timer-text-color", color)

        const svgSite = "http://www.w3.org/2000/svg"

        let svg = document.createElementNS(svgSite, "svg")

        let circle1 = document.createElementNS(svgSite, "circle")
        let circle2 = document.createElementNS(svgSite, "circle")

        circle2.setAttribute("pathLength", "1")
        circle2.setAttribute("style", "stroke-dashoffset: 1;")

        let time = document.createElement("span")
        time.className = "time"
        time.textContent = "*V*"
        let unit = document.createElement("span")
        unit.className = "unit"
        unit.textContent = "^w^"

        let h3 = document.createElement("span")
        h3.classList.add("title")
        splitStringsToBr(title, h3)
        // h3.textContent = title
        let p = document.createElement("span")
        p.classList.add("desc")
        splitStringsToBr(desc, p)
        // let a = document.createElement("a")

        // let plines = desc.split("<br>")
        // for (let i = 0; i < plines.length; i++) {
        //     const line = plines[i];
        //     p.append(line)
        //     if (i < plines.length - 1) p.append(document.createElement("br"))
        // }

        svg.appendChild(circle1)
        svg.appendChild(circle2)
        clock.appendChild(svg)
        clock.appendChild(time)
        clock.appendChild(unit)

        card.appendChild(clock)
        card.appendChild(h3)
        card.appendChild(p)

        let doc = timer ? ( 
            (unixtime >= 0 && unixtime < Date.now() / 1000) ? // did timer expire
                expiredTimerContainer : timerContainer
        ) : clockContainer

        let insertedCard = false
        for (let i = 0; i < doc.children.length; i++) {
            const child = doc.children[i];
            // @ts-ignore
            let clockTime = child.querySelector(".clock").dataset.unixtime
            if ((timer && unixtime >= 0) ? 
                    (clockTime > unixtime) : (clockTime < unixtime)) {
                doc.insertBefore(card, child)
                insertedCard = true
                break;
            }
        }
        if (!insertedCard) doc.appendChild(card)

        timers = document.querySelectorAll('.clock')
    }

    /** @param {string} desc @param {Element} h3  */
    function splitStringsToBr(desc, h3) {
        let h3lines = desc.split("<br>")
        for (let i = 0; i < h3lines.length; i++) {
            const line = h3lines[i]
            h3.append(line)
            if (i < h3lines.length - 1) h3.append(document.createElement("br"))
        }
    }

    function tick() {

        let destiny = new Date(2026, 8, 27, 13, 53)

        let now = new Date()

        for (let i = 0; i < timers.length; i++) {
            const timerElement = timers[i];
            let dest = destiny.getTime()
            // @ts-ignore
            let dataTime = parseInt(timerElement.dataset.unixtime)
            if (dataTime) {
                if (dataTime < 0) dest = dataTime
                else dest = dataTime * 1000
            }
            let { scale, time } = getTimeScaleAndTime(dest, now.getTime());
            const timerCircle = timerElement.querySelector('svg > circle + circle');
            const remaining = timerElement.querySelector('.time');
            const remainOfWhat = timerElement.querySelector('.unit');
            let dashOffset = 0
            let thickness = scale.thickness
            if (scale.name != "Years") 
                dashOffset = (1 - parseFloat(time) / scale.maxUnits);
            else 
                dashOffset = 0;
            /** @type {CSSStyleDeclaration} */
            // @ts-ignore
            let style = timerElement.style
            if (timerElement.classList.contains("timer")) {
                if (time.startsWith("-")) {
                    dashOffset = 0;
                    thickness = 10
                    style.setProperty("fill-opacity", "1")
                    style.setProperty("--timer-text-color", "#000")
                    // if (remaining) remaining.textContent = "Complete"
                    // if (remainOfWhat) remainOfWhat.textContent = ""
                    if (remaining) remaining.textContent = time
                    if (remainOfWhat) remainOfWhat.textContent = scale.name
                } else {
                    if (scale === unknownTimeScale) {
                        if (remaining) remaining.textContent = ""
                        if (remainOfWhat) remainOfWhat.textContent = ""
                    } else {
                        if (remaining) remaining.textContent = time
                        if (remainOfWhat) remainOfWhat.textContent = scale.name
                    }
                }
            } else {
                if (remaining) {
                    remaining.textContent = time.slice(time.startsWith("-") ? 1 : 0)
                }
                if (remainOfWhat) remainOfWhat.textContent = scale.name
            }
            // @ts-ignore
            timerCircle.style.strokeDashoffset = dashOffset.toString()
            style.setProperty("--timer-width", thickness.toString())
        }
    }

    setInterval(tick, 100)

    //@ts-ignore
    import("{{ (resources.Get (`common/fetch_data.js`) | resources.Fingerprint `md5`).RelPermalink }}")
    .then(async (module) => {
        let body = await module.fetchEntries()
        for (let i = 0; i < body.clocks.length; i++) {
            const entry = body.clocks[i];
            createCard(
                entry.name, 
                entry.desc, 
                entry.unix, 
                entry.color, 
                entry.timer, 
                entry.link
            )
        }
    }).catch((err) => {
        console.error("Dynamic import failed:", err);
    });

    // fetchAndParseClocks()
    // async function fetchAndParseClocks() {
    //     //@ts-ignore
    //     let body = await fetchEntries()
    //     for (let i = 0; i < body.clocks.length; i++) {
    //         const entry = body.clocks[i];
    //         createCard(
    //             entry.name, 
    //             entry.desc, 
    //             entry.unix, 
    //             entry.color, 
    //             entry.timer, 
    //             entry.link
    //         )
    //     }
    // }

})