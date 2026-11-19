//@ts-check

/*

//@ts-ignore
import("{{ (resources.Get (`common/happy-spot.js`) | resources.Fingerprint `md5`).RelPermalink }}")
.then(async (module) => {
    let happiness = await module.allowHappiness()
    idk_something_here
}).catch((err) => {
    console.error("Happy spot foreseeing failure:", err);
});

*/

/** @returns {boolean} */
export function allowHappiness() {

    let og = Math.floor(Date.now() / 10000)
    let tens = og;
    tens *= 1359031

    tens ^= tens << 5
    tens ^= tens >> 7
    tens ^= tens << 2
    tens ^= tens >> 5
    tens ^= tens << 13
    tens ^= tens << 7
    tens ^= tens << 3

    const inverseChance = 33;
    tens %= inverseChance
    if (tens < 0) tens += inverseChance;

    // console.log(og, tens)
    // return true
    return tens == 0;
}

window.addEventListener("load", () => {

    let happySpots = document.body.getElementsByClassName("happy-spot");
    let index = -1;
    let theyreeverywhere = false
    if (allowHappiness()) index = Math.floor(Math.random() * happySpots.length)
    Array.from(happySpots).forEach((it, i) => {
        if (theyreeverywhere || index == i) {
            it.classList.add("revealed")
        } else {
            it.outerHTML = ""
        }
    })

})