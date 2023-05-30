document.addEventListener("DOMContentLoaded", runFetchAllKandidater) // Når siden starter, så runner vi vores hovedmetode i vores script vi har kaldt runFetchAllKandidater.

// Vi skaffer vores table body
let tableBodyKandidater  = document.querySelector("#tblBodyKandidater")

// Det her er vores "init" metode. Den køre hele scriptet.
function runFetchAllKandidater() {
    fetchAlleKandidater()
}

// Her fylder vi vores html tabel med kandidater
function fillRowsInTable(kandidat) {
    const tableRow = document.createElement("tr");
    // Vi giver hver table row et unikt id som er kandidatRow-"id". Dette skal bruges til at slette hver row senere.
    tableRow.id = `kandidatRow-${kandidat.id}`

    tableRow.innerHTML = `
        <td>${kandidat.id}</td>
        <td>${kandidat.navn}</td>
        <td>${kandidat.parti.partiNavn}</td>
        <td><button class="btn btn-primary" id="">Update</button></td>
        <td><button class="btn btn-primary" id="deleteKandidatKnap-${kandidat.id}" value="${kandidat.id}">Delete</button></td>
        `;
    // Vi appender én row ad gangen vi laver til vores tableBodyKandidater.
    tableBodyKandidater.appendChild(tableRow);

    // Vi laver en eventListener på hver delete knap vi skaber.
    document.querySelector(`#deleteKandidatKnap-${kandidat.id}`).addEventListener('click', deleteKandidat)
}

function deleteKandidat(event){
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


