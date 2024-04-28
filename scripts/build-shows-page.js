import { addChildHTML, formatDate } from './utilities.js'
import bandApiInstance from './band-site-api.js'

let events = []; // List of events to display on shows page.

/* -------------------------------------------------------------------------- */
/*                      Get shows list from BandSite API                      */
/* -------------------------------------------------------------------------- */


// Replace events array by one obtained from BandSite API
async function getShowsList() {
    try {
        const showsList = await bandApiInstance.getShows();

        // Rename 'place' to 'venue' in each event and remove 'id' to match existing events array
        let apiEvents = showsList.map(({ id, place, ...rest }) => ({
            venue: place,
            ...rest
        }));


        // Replace timestamp by same date as in copy text eg. 1725854400000 to Mon Sept 09 2024
        let apiEventsWithDate = apiEvents.map(({ date, ...rest }) => ({
            date: formatDate(date, 'shows'),
            ...rest
        }));

        // Update the events array with the updated objects
        events = apiEventsWithDate;
    } catch (error) {

        console.log("Could not get events from API, using hardcoded list from copy deck for test purposes instead.")

        events = [
            {
                date: "Mon Sept 09 2024",
                venue: "Ronald Lane",
                location: "San Francisco, CA"
            },
            {
                date: "Tue Sept 17 2024",
                venue: "Pier 3 East",
                location: "San Francisco, CA"
            },
            {
                date: "Sat Oct 12 2024",
                venue: "View Lounge",
                location: "San Francisco, CA"
            },
            {
                date: "Sat Nov 16 2024",
                venue: "Hyatt Agency",
                location: "San Francisco, CA"
            },
            {
                date: "Fri Nov 29 2024",
                venue: "Moscow Center",
                location: "San Francisco, CA"
            },
            {
                date: "Wed Dec 18 2024",
                venue: "Press Club",
                location: "San Francisco, CA"
            }
        ];
    }
}



/* -------------------------------------------------------------------------- */
/*               Create and insert the table content dynamically              */
/* -------------------------------------------------------------------------- */


function createEventTableContent() {
    const tbody = document.querySelector("table tbody");
    tbody.innerText = "";

    // Create table rows for each event
    events.forEach(function (event) {
        // Create a new table row
        const row = document.createElement("tr");

        // Also add shared class for styling
        row.classList.add('shows__show-row', 'shows__show-row--data');

        // Create cells for each property in the event
        Object.keys(event).forEach(function (key) {
            // Create new td row with event data from events array, with shared class for styling. eg. shows__show-location
            const cell = addChildHTML(row, 'td', 'shows__show-cell', event[key]);

            // Also add class named after event key
            cell.classList.add(`shows__show-cell--${key}`);

            // Make the table more accessible, by setting the headers attribute on td to the corresponding header id, so it can be used by screen readers
            const thElement = document.querySelector(`th#${key}`);
            let headerId = "";
            if (thElement) {
                headerId = thElement.id;
            }

            cell.setAttribute("headers", headerId);

            // Set the data-label attribute on td to the corresponding header text so it can then be displayed on mobile, using css
            let headerText = "";
            if (thElement) {
                headerText = thElement.textContent;
            }
            cell.setAttribute("data-label", headerText);
        });

        // Add a button cell as the last column 
        const buttonCell = addChildHTML(row, 'td', 'shows__show-cta-container');

        // Also add class named after event key
        buttonCell.classList.add('shows__show-cell');


        addChildHTML(buttonCell, 'button', 'shows__show-cta-btn', 'Buy Tickets');

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

/* -------------------------------------------------------------------------- */
/*         Mark row as selected by adding class if user clicks on row         */
/* -------------------------------------------------------------------------- */

function selectRow() {
    const rows = document.querySelectorAll('.shows__show-row--data')

    rows.forEach(function (row) {
        row.addEventListener("click", function (event) {
            event.preventDefault(); // prevent page reload on click

            // Remove the 'selected' class from all rows
            rows.forEach(function (otherRow) {
                if (otherRow !== row && otherRow.classList.contains("shows__show-row--selected")) {
                    otherRow.classList.remove("shows__show-row--selected");
                }
            });

            // Toggle the 'selected' class for the clicked row
            row.classList.toggle("shows__show-row--selected");
        });
    });
}


/* ----------------------------------------------------------------- */
/*                    Main function to list events                   */
/* ----------------------------------------------------------------- */

async function buildShowsPage() {
    await getShowsList() // first get shows list

    // then add shows to table in page
    createEventTableContent();

    // support shows event selection
    selectRow();
}

buildShowsPage() // run at page load