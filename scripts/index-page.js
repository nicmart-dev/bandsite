
/* List of testimonial comments from users.
Note: Turned copy text to array using ChatGPT  */
const testimonials = [
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


// Loop through testimonials array and add HTML
testimonials.forEach((testimonial) => {
    addComment(commentList, testimonial);
})


function addChildHTML(parentEl, childEl, classAttr = '', text = '', top = false) {
    const newChildEl = document.createElement(childEl);

    // add text to new node if passed as argument
    if (text != '') {
        const newChildText = document.createTextNode(text);
        newChildEl.appendChild(newChildText);
    }

    //add new element to DOM (at the top if new comment)
    if (top === true) {
        parentEl.insertBefore(newChildEl, parentEl.firstChild);
    }
    else
        parentEl.appendChild(newChildEl);

    // add attribute if provided
    if (classAttr != '') {
        newChildEl.classList.add(classAttr);
    }

    // return new child element so we can add grandchildren
    return newChildEl;
}

function addComment(grandparent, testimonial, n = true) {

    //add article container (and indicate if new comment or not)
    const commentContainer = addChildHTML(grandparent, 'article', 'comments__comment-container', '', n);

    //add image container inside
    const imageContainer = addChildHTML(commentContainer, 'div', 'comments__image-container')

    //add image inside
    addChildHTML(imageContainer, 'div', 'comments__avatar');

    //add container containing name, date, and comment text as sibbling  of image container
    const commentTxtContainer = addChildHTML(commentContainer, 'div', 'comments__comment-txt-container')

    //add container containing name and date inside
    const userNameDateContainer = addChildHTML(commentTxtContainer, 'div', 'comments__user-name-date-container')

    //add name and date headings inside
    addChildHTML(userNameDateContainer, 'h3', 'comments__user-name', testimonial.name)
    addChildHTML(userNameDateContainer, 'h4', 'comments__date', testimonial.date)

    //add comment text
    addChildHTML(commentTxtContainer, 'p', 'comments__comment-txt', testimonial.comment)

}

// Add new comment to top using array sort() method to sort by date parameter


const commentForm = document.getElementById('new-comment-form')
commentForm.addEventListener('submit', submitComment);

function submitComment(event) {

    event.preventDefault(); // keeps the page from reloading on submit


    // Get today's date and format it to MM/DD/YYYY to match existing comments
    const dateFormat = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };
    const date = new Date(Date.now()).toLocaleDateString(undefined, dateFormat);


    // Constructs a new comment object
    const newComment =
    {
        name: event.target.username.value,
        date: date,
        comment: event.target.comment.value,
    };

    //add as new comment
    addComment(commentList, newComment, true);
}