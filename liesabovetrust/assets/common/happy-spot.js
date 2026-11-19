window.addEventListener("load", () => {

    let happySpots = document.body.getElementsByClassName("happy-spot");
    let index = -1;
    let theyreeverywhere = false
    if (Math.random() < .03) index = Math.floor(Math.random() * happySpots.length)
    Array.from(happySpots).forEach((it, i) => {
        if (theyreeverywhere || index == i) {
            it.classList.add("revealed")
        } else {
            it.outerHTML = ""
        }
    })

})