//@ts-check
/*

import("{{ (resources.Get (`common/fetch_data.js`) | resources.Fingerprint `md5`).RelPermalink }}")
.then(async (module) => {
    let body = await module.fetchEntries()
    for (let i = 0; i < body.<array>.length; i++) {
        const entry = body.<array>[i];
        addSomething(body.name)
    }
}).catch((err) => {
    console.error("Dynamic import failed:", err);
});

*/
/** @returns {Promise<any>} */
export async function fetchEntries() {
    // let fetcher = await fetch("https://cors.io/?u=https://pastebin.com/raw/1BrbMHt2")
    // let fetcher = await fetch("../assets/data.json", { cache: "reload" })
    let fetcher = await fetch("https://raw.githubusercontent.com/LevAlTru/Nekoweb-subdomen/refs/heads/main/liesabovetrust/assets/assets/data.json", { cache: "reload" })
    if (fetcher.status != 200) {
        // console.error("Error while fetching data from Pastebin.com.", fetcher.statusText, fetcher);
        console.error("Error while fetching data.", fetcher.statusText, fetcher);
        return {}
    }
    let fetchjson = await fetcher.json()
    // let body = JSON.parse(fetchjson.body)
    // let body = JSON.parse(fetcher.body)
    return fetchjson;
}