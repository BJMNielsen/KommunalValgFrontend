document.addEventListener("DOMContentLoaded", runFetchAllKandidater) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllKandidater.

// Vi skaffer vores table body
let tableBodyKandidater = document.querySelector("#tblBodyKandidater")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllKandidater() {
    fetchAlleKandidater()
}

// Her fylder vi vores html tabel med kandidater
function fillRowsInTable(kandidat) {
    console.log(kandidat)
    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er kandidatRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `kandidatRow-${kandidat.id}`

    tableRow.innerHTML = `
        <td>${kandidat.id}</td>
        <td>${kandidat.navn}</td>
        <td>${kandidat.parti.partiNavn}</td>
        <td><button class="btn btn-primary" id="updateKandidatKnap-${kandidat.id}" value="${kandidat.id}" data-bs-toggle="modal" data-bs-target="#updateKandidatModal">Update</button></td>
        <td><button class="btn btn-primary" id="deleteKandidatKnap-${kandidat.id}" value="${kandidat.id}">Delete</button></td>
        `;

    // Vi appender én row ad gangen vi laver til vores tableBodyKandidater.
    tableBodyKandidater.appendChild(tableRow);

    // Vi laver en eventlistener på hver update knap der kalder addHiddenIdToInputField metoden, som adder kandidat id til et hidden form input felt
    document.querySelector(`#updateKandidatKnap-${kandidat.id}`).addEventListener('click', addHiddenIdToInputField)

    // Her er en eventlistener der køre en metoder der fylder vores modal dropdown med partier man kan vælge imellem, når man trykker på "Update Kandidat" knappen på forsiden
    document.querySelector(`#updateKandidatKnap-${kandidat.id}`).addEventListener('click', fillDropDownUpdate)

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteKandidatKnap-${kandidat.id}`).addEventListener('click', deleteKandidat)
}

// Vi har lavet et hidden input field i vores update modals form, som vi lægger vores kandidats id over i. Man kan ikke update/put uden at give et id med
function addHiddenIdToInputField(event){
    const kandidatId = event.target.value // vores event er knap trykket, og fordi knappen er givet value == kandidaten id, kan vi får fat i id'et
    document.querySelector("#updateIdFormHiddenInput").value = kandidatId; // man kunne honestly også bare have gemt vores event.target.value i en global variabel her, i stedet for i et hidden field. Nok nemmere.
}

document.querySelector("#updateKandidatModalBtn").addEventListener('click', updateKandidat)

function updateKandidat(){
    const updateModalForm = document.querySelector("#modalFormUpdateKandidat")
    const kandidatObjekt = preparePlainFormData(updateModalForm) // vi laver alt input fra formen om til et javascript objekt.
    kandidatObjekt.parti = parti // Vi siger at kandidatObjekt også skal indeholde et parti, og at værdien er den som vi har gemt i vores parti variabel (i partiPicker metoden). Den laver en variabel hvis den ikke eksistere.
    const kandidatId = document.querySelector("#updateIdFormHiddenInput").value; // Vi skaffer kandidaten id fra det hidden form input felt.
    kandidatObjekt.id = kandidatId; // Vi sætte rvores kandidatObjekts id til at være lig dette id vi hentede fra hidden input feltet,

    // Nu har vi de informationer vi skal bruge for at PUT vores kandidat. Vi indtaster url + fetchmetode + objekt vi gerne vil update.
    fetchAny("kandidat", "PUT", kandidatObjekt).then(kandidat => {
        console.log("Updated kandidat: ", kandidat) // hvis det lykkedes log'er vi kandidaten.
        alert("Updated Kandidat: " + kandidatObjekt.navn)
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })
}


// Her er en eventlistener der køre en metoder der fylder vores modal dropdown med partier man kan vælge imellem, når man trykker på "Create Kandidat" knappen på forsiden
document.querySelector("#createKandidatOpenModalButton").addEventListener('click', fillDropDownCreate)

// Den her eventlistener kalder så metoden der laver kandidaten når man trykker på modal knappen "create kandidate".
document.querySelector("#createKandidatModalBtn").addEventListener('click', createKandidat)

// Function der skaffer vores form data og laver den om til et javascript objekt, og så poster det til backend.
function createKandidat(){
    const createModalForm = document.querySelector("#modalFormCreateKandidat")
    const kandidatObjekt = preparePlainFormData(createModalForm) // vi laver alt input fra formen om til et javascript objekt.
    kandidatObjekt.parti = parti // Vi siger at kandidatObjekt også skal indeholde et parti, og at værdien er den som vi har gemt i vores parti variabel (i partiPicker metoden). Den laver en variabel hvis den ikke eksistere.
    // url + fetchmetode + objekt vi gerne vil update
    fetchAny("kandidat", "POST", kandidatObjekt).then(kandidat => {
        alert("Created Kandidat: " + kandidatObjekt.navn)
        console.log("Created Kandidat: ", kandidat) // hvis det lykkedes log'er vi kandidaten.
        window.location.reload()
    }).catch(error => {
        console.error(error) // hvis det fejler log'er vi error.
    })

}

let parti = null;

// Metoder der får fat i dropdown menuen i modallen, og sætter alle partierne ind som valgmulighederne, ved at fetche dem fra backend og lave et liste element med hver af dem.
function fillDropDownUpdate() {
    const dropDownMenu = document.querySelector(`#dropDownMenuUpdateModal`);
    dropDownMenu.innerHTML = ''; // vi sletter lige alt i listen først

    fetchAny("partier", "GET", null).then(partier => {
        partier.forEach(parti => {
            const dropDownListElement = document.createElement("li");
            dropDownListElement.parti = parti // Vi laver et team for dropDownListElement og sætter det til at være == team fra vores fetch kald
            dropDownListElement.className = "dropdown-item"
            dropDownListElement.textContent = parti.partiNavn;
            dropDownMenu.appendChild(dropDownListElement)
            dropDownListElement.addEventListener("click", partiPicker) //Partipicker er en metode der sætter dropDownMenuens navn til at vise det element du har valgt, og gemmer værdien i en variabel så vi kan access den.
        })
    }).catch(error => {
        console.error(error)
    })

    function partiPicker(event) {
        const listeElement = event.target //elementet er li elementet, og inde i listen er der et team.

        const dropDownButton = document.querySelector("#dropDownButtonUpdate")

        dropDownButton.textContent = listeElement.parti.partiNavn // Vi sætter dropDownMenuens text til at være vores valg af team.
        // vi gemmer vores valgte team i vores team constant ude for metoden.
        parti = listeElement.parti
    }
}

// Metoder der får fat i dropdown menuen i modallen, og sætter alle partierne ind som valgmulighederne, ved at fetche dem fra backend og lave et liste element med hver af dem.
function fillDropDownCreate() {
    const dropDownMenu = document.querySelector(`#dropDownMenuCreateModal`);
    dropDownMenu.innerHTML = ''; // vi sletter lige alt i listen først

    fetchAny("partier", "GET", null).then(partier => {
        partier.forEach(parti => {
            const dropDownListElement = document.createElement("li");
            dropDownListElement.parti = parti // Vi laver et team for dropDownListElement og sætter det til at være == team fra vores fetch kald
            dropDownListElement.className = "dropdown-item"
            dropDownListElement.textContent = parti.partiNavn;
            dropDownMenu.appendChild(dropDownListElement)
            dropDownListElement.addEventListener("click", partiPicker) //Partipicker er en metode der sætter dropDownMenuens navn til at vise det element du har valgt, og gemmer værdien i en variabel så vi kan access den.
        })
    }).catch(error => {
        console.error(error)
    })

    // Metode der sætter dropdownmenuens navn til at være det element (parti) du har valgt, og så gemmer det i en parti variabel som vi kan bruge i CreateKandidat funktionen.
    function partiPicker(event) {
        const listeElement = event.target //elementet er li elementet, og inde i listen er der et team.

        const dropDownButton = document.querySelector("#dropDownButtonCreate")

        dropDownButton.textContent = listeElement.parti.partiNavn // Vi sætter dropDownMenuens text til at være vores valg af team.
        // vi gemmer vores valgte team i vores team constant ude for metoden.
        parti = listeElement.parti
    }
}


document.querySelector("#updateKandidatModalBtn").addEventListener("click", updateKandidat)

function deleteKandidat(event) {
    const kandidatId = event.target.value
    fetchAny(`kandidat/${kandidatId}`, "DELETE", null).then(kandidat => {
        alert(`Kandidat med id: ${kandidatId} og navn: ${kandidat.navn} er blevet slettet`);

        // Her bruger vi det unikke id hver table row har, til at få fat i vores row, og derefter slette det fra table body delen. På den måde er vores liste stadig sortet efter vi deleter elementer.
        const rowToDelete = document.querySelector(`#kandidatRow-${kandidatId}`)
        tableBodyKandidater.removeChild(rowToDelete);

    }).catch(error => {
        console.error(error)
    })
}

function fetchAlleKandidater() {
    fetchAny("kandidater", "GET", null).then(kandidater => {
        console.log(kandidater)
        // Vi fetcher kandidaterne og hvis det er en success .then:
        kandidater.forEach(kandidat => { // For hver kandidat i vores liste af kandidater gør vi følgende
            fillRowsInTable(kandidat)
        })
    }).catch(error => { // hvis vi får en error, catcher vi den og gør følgende:
        console.error(error);
    })
}

function sortCandidatesByParty() {
    // Retrieve the table rows as an array
    const tableRowsArray = Array.from(tableBodyKandidater.children);

    // Sort the table rows based on the party name
    const sortedRows = tableRowsArray.sort((rowA, rowB) => {
        // Extract the party names from each row
        const partyA = rowA.children[2].innerText.toLowerCase();
        const partyB = rowB.children[2].innerText.toLowerCase();

        // Compare the party names using localeCompare for case-insensitive sorting
        return partyA.localeCompare(partyB);
    });

    // Clear existing rows from the table body
    while (tableBodyKandidater.firstChild) {
        tableBodyKandidater.removeChild(tableBodyKandidater.firstChild);
    }

    // Append the sorted rows back to the table body
    sortedRows.forEach(row => {
        tableBodyKandidater.appendChild(row);
    });
}

// Denne metode laver et form element om til et javascript objekt vi kalder plainFormData.
function preparePlainFormData(form) {
    console.log("Received the Form:", form)
    const formData = new FormData(form)  // indbygget metode, behøves ikke forstås.
    console.log("Made the form in to FormData:", formData)
    const plainFormData = Object.fromEntries(formData.entries())
    console.log("Changes and returns the FormData as PlainFormData:", plainFormData)
    return plainFormData
}

// Når vi trykker på dropDown knappen i vores UpdateModel så køre fillUpdateDropDown og fylder den med partier
document.querySelector("#dropDownButtonUpdate").addEventListener("click", fillUpdateDropDown)


