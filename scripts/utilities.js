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
export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
    return formattedDate.replace(',', ''); // Remove the comma from the day
}