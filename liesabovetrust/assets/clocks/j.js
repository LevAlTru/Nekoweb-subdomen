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
    const yearInDecade = 10

    /** @type {TimeScale[]} */
    const timeScales = []
    timeScales.push(new TimeScale(
        "Decades", 
        yearInDecade * monthsInYear * daysInMonth * hoursInDay * 
            minutesInHour * secoundsInMinute * millisecondsInSecond, 
        1,
        8,
        25
    ))
    timeScales.push(new TimeScale(
        "Years", 
        monthsInYear * daysInMonth * hoursInDay * minutesInHour * 
            secoundsInMinute * millisecondsInSecond, 
        yearInDecade,
        7,
        20
    ))
    timeScales.push(new TimeScale(
        "Months", 
        daysInMonth * hoursInDay * minutesInHour * secoundsInMinute * 
            millisecondsInSecond, 
        monthsInYear,
        6,
        15
    ))
    timeScales.push(new TimeScale(
        "Days",
        hoursInDay * minutesInHour * secoundsInMinute * millisecondsInSecond, 
        daysInMonth,
        5,
        10
    ))
    timeScales.push(new TimeScale(
        "Hours", 
        minutesInHour * secoundsInMinute * millisecondsInSecond, 
        hoursInDay,
        4,
        7
    ))
    timeScales.push(new TimeScale(
        "Minutes", 
        secoundsInMinute * millisecondsInSecond, 
        minutesInHour,
        2,
        5
    ))
    timeScales.push(new TimeScale(
        "Seconds", 
        millisecondsInSecond, 
        secoundsInMinute,
        1,
        3
    ))
    const unknownTimeScale = new TimeScale(
        "Unknown",
        1,
        1,
        1,
        15
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
        let expired = (unixtime >= 0 && unixtime < Date.now() / 1000);
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
        if (!timer || !expired) clock.style.setProperty("--sel-col", color)
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
        h3.style.setProperty("--sel-col", color)
        h3.innerHTML = title
        let p = document.createElement("span")
        p.classList.add("desc")
        p.style.setProperty("--sel-col", color)
        p.innerHTML = desc

        svg.appendChild(circle1)
        svg.appendChild(circle2)
        clock.appendChild(svg)
        clock.appendChild(time)
        clock.appendChild(unit)

        card.appendChild(clock)
        card.appendChild(h3)
        card.appendChild(p)

        let doc = timer ? ( 
             expired ? expiredTimerContainer : timerContainer
        ) : clockContainer

        let insertedCard = false
        for (let i = 0; i < doc.children.length; i++) {
            const child = doc.children[i];
            // @ts-ignore
            let clockTime = child.querySelector(".clock").dataset.unixtime
            if (timer && unixtime >= 0 && !expired ? (clockTime > unixtime) : (clockTime < unixtime)) {
                doc.insertBefore(card, child)
                insertedCard = true
                break;
            }
        }
        if (!insertedCard) doc.appendChild(card)

        timers = document.querySelectorAll('.clock')
    }

    function tick() {

        let destiny = new Date(2025, 5, 5, 5, 5)

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
            if (scale.maxUnits != 1) 
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

    if (window.location.pathname.includes("/clocks")) {
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
    }
})