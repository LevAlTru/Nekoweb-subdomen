window.addEventListener("load", () => {
    var strBuilder = ``

    for (let i = 0; i < 16; i++) {
        // strBuilder += `<div class="row">`
        // for (let j = 0; j < 18; j++) {
            strBuilder += `<div id="meowSquared">${i}|asfafaddgdagadgadgadgadgdagdd$j</div>`
        // }
        // strBuilder += `</div>`
    }

    document.getElementById("meow").innerHTML += strBuilder;
})