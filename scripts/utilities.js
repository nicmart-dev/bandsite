/* -------------------------------------------------------------------------- */
/*                  Utility function to create element in DOM                 */
/* -------------------------------------------------------------------------- */
export function addChildHTML(parentEl, childEl, classAttr = '', text = '') {
    const newChildEl = document.createElement(childEl);

    // add text to new node if passed as argument
    if (text != '') {
        const newChildText = document.createTextNode(text);
        newChildEl.appendChild(newChildText);
    }

    //add new element to DOM

    parentEl.appendChild(newChildEl);

    // add attribute if provided
    if (classAttr != '') {
        newChildEl.classList.add(classAttr);
    }

    // return new child element so we can add grandchildren
    return newChildEl;
}


/* -------------------------------------------------------------------------- */
/*                  Utility function to display date from API                 */
/* -------------------------------------------------------------------------- */
export function formatDate(timestamp, page) {
    const date = new Date(timestamp);
    let formattedDate = '';

    switch (page) {
        case 'shows':
            formattedDate = date.toLocaleDateString('en-us', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).split(",").join("");
            break;

        case 'bio':
            const month = date.getMonth() + 1; // Months are zero-based, so we add 1
            const day = date.getDate();
            const year = date.getFullYear();
            formattedDate = `${month}/${day}/${year}`;
            break;

        default:
            break;
    }

    return formattedDate;
}


export default addChildHTML;