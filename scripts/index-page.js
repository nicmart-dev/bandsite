
/* List of comment comments from users.
Note: Turned copy text to array using ChatGPT  */
const comments = [
    {
        name: "Victor Pinto",
        date: "11/02/2023",
        comment: "This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains."
    },
    {
        name: "Christina Cabrera",
        date: "10/28/2023",
        comment: "I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day."
    },
    {
        name: "Isaac Tadesse",
        date: "10/20/2023",
        comment: "I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough."
    }
];

/* -------------------------------------------------------------------------- */
/*                          Add Comments to bio page                          */
/* -------------------------------------------------------------------------- */

// Get DOM element where to insert comments 
const commentList = document.querySelector('.comments__list-container')

function loopThroughComments() {

    commentList.innerText = ""; // Clears all comments from the page
    // Loop through comments array and add HTML
    comments.forEach((comment) => {
        addComment(commentList, comment);
    })
}




function addChildHTML(parentEl, childEl, classAttr = '', text = '') {
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

// Generic function to add existing or new comment
function addComment(grandparent, comment) {

    //add article container (and indicate if new comment or not)
    const commentContainer = addChildHTML(grandparent, 'article', 'comments__comment-container');

    //add image container inside
    const imageContainer = addChildHTML(commentContainer, 'div', 'comments__image-container')

    //add image inside
    addChildHTML(imageContainer, 'div', 'comments__avatar');

    //add container containing name, date, and comment text as sibbling  of image container
    const commentTxtContainer = addChildHTML(commentContainer, 'div', 'comments__comment-txt-container')

    //add container containing name and date inside
    const userNameDateContainer = addChildHTML(commentTxtContainer, 'div', 'comments__user-name-date-container')

    //add name and date headings inside
    addChildHTML(userNameDateContainer, 'h3', 'comments__user-name', comment.name)
    addChildHTML(userNameDateContainer, 'h4', 'comments__date', comment.date)

    //add comment text
    addChildHTML(commentTxtContainer, 'p', 'comments__comment-txt', comment.comment)

}

//Show new submitted comments 
const commentForm = document.getElementById('new-comment-form')
commentForm.addEventListener('submit', submitComment);

function submitComment(event) {

    event.preventDefault(); // keeps the page from reloading on submit


    // Get today's date and format it to MM/DD/YYYY to match existing comments
    const dateFormat = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const today = new Date(Date.now()).toLocaleDateString(undefined, dateFormat);


    // Constructs a new comment object
    const newComment =
    {
        name: event.target.username.value,
        date: today,
        comment: event.target.comment.value,
    };

    //add new comment object as new comment
    comments.unshift(newComment); // adds to the start of the array

    loopThroughComments(); // Re-renders to the page all comments from the comment array

    //clear form after submission
    event.target.reset();

    // remove placeholder text
    event.target.username.placeholder = "";
    event.target.comment.placeholder = "";

    //disable the fields and comment button
    document.getElementById("submit").disabled = true;
    event.target.username.disabled = true;
    event.target.comment.disabled = true;
}

loopThroughComments() // runs when page loads