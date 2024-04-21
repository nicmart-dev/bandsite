/* List of events
Note: Turned copy text to array using ChatGPT  */
const events = [
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

// Create and insert the table content dynamically
function createEventTableContent() {
    const tbody = document.querySelector("table tbody");
    tbody.innerText = "";

    // Create table rows for each event
    events.forEach(function (event) {
        // Create a new table row
        const row = document.createElement("tr");

        // Create cells for each property in the event
        Object.keys(event).forEach(function (key) {
            // Create new td row with event data from events array, with class named after event key. eg. shows__show-location
            const cell = addChildHTML(row, 'td', `shows__show-${key}`, event[key]);

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
        const buttonCell = addChildHTML(row, 'td',);
        addChildHTML(buttonCell, 'button', 'shows__show-cta-btn', 'BUY TICKETS');

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

// Create and insert the table content dynamically at page load
createEventTableContent();
