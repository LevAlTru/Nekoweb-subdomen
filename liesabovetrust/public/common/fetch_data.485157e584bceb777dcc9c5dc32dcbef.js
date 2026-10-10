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
    let fetcher = await fetch("https://cors.io/?u=https://pastebin.com/raw/1BrbMHt2")
    if (fetcher.status != 200) {
        console.error("Error while fetching data from Pastebin.com.", fetcher.statusText, fetcher);
        return {}
    }
    let fetchjson = await fetcher.json()
    let body = JSON.parse(fetchjson.body)
    return body;
}