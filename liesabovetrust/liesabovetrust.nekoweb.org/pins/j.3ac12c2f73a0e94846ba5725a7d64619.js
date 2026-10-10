// @ts-check

window.addEventListener("load", () => {
    
    document.getElementById("add_new_card")?.addEventListener("click", () => createNewCard(true))

    const MAX_COLLUMS = 7
    const CONTAINER = document.getElementById("pins_container")

    class CardHolder {
        constructor() {
            /** @type {Element} */
            //@ts-ignore
            this.container = CONTAINER
            /** @type {Element[]} */
            this.cards = []
            /** @type {number[]} */
            this.heights = []
            for (let i = 0; i < MAX_COLLUMS; i++) {
                this.heights[i] = 0
            }
        }

        /** @returns {boolean} */
        shouldRearrange() {
            return this.container != null && this.cards.length > 0
        }
        
        getMinimumHeightIndex() {
            let minimumHeight = -1
            let minimumHeightIndex = -1

            let lastI = 0
            for (lastI = 0; lastI < this.container.children.length; lastI++) {
                /** @type {HTMLElement} */
                //@ts-ignore
                let element = this.container.children.item(lastI)
                let style = getComputedStyle(element)
                if (style.display == "none") {
                    break
                }
                let height = this.heights[lastI]
                if (minimumHeight < 0 || minimumHeight > height) {
                    minimumHeight = height
                    minimumHeightIndex = lastI
                }
                // console.log(i + ", " + height);
            }

            let collumAC = false

            if (lastI != lastCollumAmount) {
                lastCollumAmount = lastI
                collumAC = true
                console.log("New collum amount: " + lastI);
            }

            return { collumAC, minimumHeightIndex }
        }
        

        removeAllVisibleCards() {
            for (let i = 0; i < this.container.children.length; i++) {
                const collum = this.container.children[i]
                collum.innerHTML = ""
            }
            this.heights.fill(0)
        }

        /** @param {HTMLElement} element @param {number} minimumHeightIndex */
        addCardToVisibles(element, minimumHeightIndex) {
            let el = element.cloneNode(true)
            cardHolder.container.children.item(minimumHeightIndex)?.appendChild(el)
            //@ts-ignore
            cardHolder.heights[minimumHeightIndex] += parseFloat(getComputedStyle(el).height)
        }
    }

    /**
     * @type {CardHolder}
     */
    const cardHolder = new CardHolder()

    let lastCollumAmount = -1;

    function randomImg() {
        let rand = Math.random()
        let ext = "png"

        if (rand < .33) ext = "jpg"
        else if (rand < .66) ext = "gif"
        return "../assets/chaos/_ (" + Math.floor(Math.random() * 8 + 1) + ")." + ext
    }

    /** @param {string} imgPath @param {string} title @param {string} paragraph  */
    function createCard(imgPath, title, paragraph) {
        let a = document.createElement("div")
        a.className = "card"

        let link = document.createElement("a")
        link.href = imgPath

        let img = document.createElement("img")
        img.src = imgPath
        img.alt = imgPath

        link.appendChild(img)

        let h3 = document.createElement("h3")
        h3.textContent = title

        let p = document.createElement("p")
        p.textContent = paragraph

        a.appendChild(link)
        a.appendChild(h3)
        a.appendChild(p)

        return a
        // parent.push(a)
    }

    /** @param {boolean} forced */
    function rearrangeCards(forced = false) {
        // let container = document.getElementById("pins_container")

        if (!cardHolder.shouldRearrange()) return

        let collumAmountChanged = false

        // /** @type {number[]} */
        // let heights = []
        // for (let i = 0; i < 7; i++) {
        //     heights[i] = 0
        // }

        for (let cardIndex = 0; cardIndex < cardHolder.cards.length; cardIndex++) {
            let { collumAC, minimumHeightIndex } = cardHolder.getMinimumHeightIndex()

            collumAmountChanged ||= collumAC

            if (!collumAmountChanged && !forced) {
                break
            }

            if (cardIndex == 0) {
                cardHolder.removeAllVisibleCards()
            }

            const element = cardHolder.cards[cardIndex].cloneNode(true)

            //@ts-ignore
            cardHolder.addCardToVisibles(element, minimumHeightIndex)
        }
    }

    /** @param {Element} card  */
    function placeNewCard(card) {
        let { collumAC, minimumHeightIndex } = cardHolder.getMinimumHeightIndex()

        let copy = card.cloneNode(true)
        //@ts-ignore
        cardHolder.addCardToVisibles(copy, minimumHeightIndex)
    }

    for (let i = 0; i < 10; i++) {
        createNewCard(false)
    }

    window.addEventListener("resize", () => rearrangeCards())
    rearrangeCards()

    /** @param {boolean} addNow */
    function createNewCard(addNow = false) {
        let newCard = createCard(randomImg(), "title", "par ".repeat(Math.floor(Math.random() * 66)))
        cardHolder.cards.push(newCard)

        if (addNow) {
            placeNewCard(newCard)
        }
    }

})