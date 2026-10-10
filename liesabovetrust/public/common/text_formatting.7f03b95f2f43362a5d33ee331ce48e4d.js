//@ts-check

/*
<script src="../common/text_formatting.js"></script>
*/

const WOKE_FRAMES = [
    {color: 'rgba(224    , 96    , 96    , 1)'},
    {color: 'rgba(230    , 210   , 96    , 1)'},
    {color: 'rgba(195    , 232   , 93    , 1)'},
    {color: 'rgba(135    , 232   , 86    , 1)'},
    {color: 'rgba(79     , 209   , 207   , 1)'},
    {color: 'rgba(113    , 74    , 255   , 1)'},
    {color: 'rgba(175    , 83    , 237   , 1)'},
    {color: 'rgba(209    , 82    , 171   , 1)'},
    {color: 'rgba(224    , 96    , 96    , 1)'}
]
const WOKE_PARAM = {
    duration: 5000,
    direction: 'normal',
    easing: 'linear', 
    iterations: Infinity,
    delay: 0,
    letter_offset: 333.33
}

const WAVE_FRAMES = [
    { top: '.07em'  },
    { top: '-.07em' }
]
const WAVE_PARAM = {
    duration: 1000,
    direction: 'alternate',
    easing: 'cubic-bezier(0.45,0.05,0.55,0.95)', 
    iterations: Infinity,
    delay: 0,
    letter_offset: 333.33
}

const TEXT_ANIMATIONS = [
    {name: "woke", frames: WOKE_FRAMES, param: WOKE_PARAM},
    {name: "wavy", frames: WAVE_FRAMES, param: WAVE_PARAM},
]

window.addEventListener('load', function () {
    
    /** @type {Set<Element>} */
    const set = new Set()
    TEXT_ANIMATIONS.forEach(anim => Array.from(document.getElementsByClassName("text-" + anim.name)).forEach(it => set.add(it)))

    for (const element of set) {
        if (!element) {
            console.warn("Username was not found. Nothing is animated.");
            return
        }

        element.innerHTML = element.textContent.split("")
            .map(it => "<span>" + it + "</span>")
            .join("");
        
        let fun = getAnimations(element)

        Array.from(element.children).forEach((value, i) => {
            fun.forEach(it => {
                let param = structuredClone(it.param)
                param.delay = ((i - element.children.length) * it.param.letter_offset)
                //@ts-ignore
                if (it.name === "wavy") value.style.position = "relative"
                //@ts-ignore
                value.animate(it.frames, param)
            })
        })
    }

    /** @param {Element} element  */
    function getAnimations(element) {
        let ar = Array.from(element.classList)
            .filter(classname => classname.startsWith("text-"))
            .map(classname => TEXT_ANIMATIONS.find(it => it.name === classname.slice(5)))
            .filter(it => it != undefined)
        return ar
    }

})