// Function der skaffer vores form data og laver den om til et javascript objekt, og så poster det til backend.

// asd
document.querySelector("#formCreateKandidat").addEventListener('submit', createKandidat)





async function createKandidat(event){

    event.preventDefault(); // Her stopper vi formen i at poste, da vi gerne nedenunder selv vil bestemme hvordan vi poster.

    const form = document.querySelector("#formCreateKandidat") // const form = event.target lige så godt.
    const kandidatObjekt = preparePlainFormData(form) // vi laver alt input fra formen om til et javascript objekt.
    const partiNavnInput = kandidatObjekt.parti


    try {
        kandidatObjekt.parti = await fetchAny(`parti/name/${partiNavnInput}`, "GET", null)
        const createdKandidat = await fetchAny(`kandidat`, "POST", kandidatObjekt)
        alert("It was successful to create/post Kandidaten: " + createdKandidat.navn)

    } catch (error) {
        console.error("Had an error trying to create the Kandidat:" , kandidatObjekt)
        console.error(error)
    }


    /*
    // url + fetchmetode + objekt vi gerne vil update
    fetchAny("kandidat", "POST", kandidatObjekt).then(kandidat => {
        alert("Created Kandidat: " + kandidatObjekt.navn)
        console.log("Created Kandidat: ", kandidat) // hvis det lykkedes log'er vi kandidaten.
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
*/
}