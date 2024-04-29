import { addChildHTML, formatDate } from './utilities.js'
import bandApiInstance from './band-site-api.js'

let comments = []; // List of comments to display on bio page


/* ------------------------------------------------------------------ */
/*                      Display Comments on page                      */
/* ------------------------------------------------------------------ */

async function displayComments() {

    let apiSuccess = ''; // use to conditionally display Delete button

    //Try to get existing comments from BandSite API, and if not, display static comments from copy deck.
    try {
        const commentsList = await bandApiInstance.getComments();
        // Restructure to match existing comments array, removing id and likes properties
        let apiComments = commentsList.map(({ timestamp, ...rest }) => ({
            date: formatDate(timestamp, 'bio'), //format timestamp to date
            ...rest
        }));

        // Update the events array with the updated objects
        comments = apiComments;
        apiSuccess = true;
    } catch (error) {
        apiSuccess = false;
        console.log("Could not get comments from API, using hardcoded list from copy deck for test purposes instead.")
        if (comments.length === 0) {
            comments = [
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
        }
    }

    // Display comments on page 
    // Get DOM element where to insert comments 
    const commentList = document.querySelector('.comments__list-container')

    commentList.innerText = ""; // Clears all comments from the page
    // Loop through comments array and add HTML
    comments.forEach((comment) => {

        //add article container (and indicate if new comment or not)
        const commentContainer = addChildHTML(commentList, 'article', 'comments__comment-container');

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

        //if comments retrieved from api, add Like and Delete buttons
        if (apiSuccess) {
            const btnContainer = addChildHTML(commentTxtContainer, 'div', 'comments__button-container')
            btnContainer.setAttribute("id", comment.id); // set comment id as button id to be able to use it to use like/delete API

            const likeBtn = addChildHTML(btnContainer, 'button', 'comments__button-like', `Like `)
            likeBtn.addEventListener('click', likeComment, { once: true }); // allow to like comment but only once
            addChildHTML(likeBtn, 'span', '', `(${comment.likes})`)

            const deleteBtn = addChildHTML(btnContainer, 'button', 'comments__button-delete', "Delete")
            deleteBtn.addEventListener('click', deleteComment);
        }
    })

}



/* -------------------------------------------------------------------------- */
/*                        Post and display new comments                       */
/* -------------------------------------------------------------------------- */

// add event listener at page load
const commentForm = document.getElementById('new-comment-form')
commentForm.addEventListener('submit', submitComment);

async function submitComment(event) {

    event.preventDefault(); // keeps the page from reloading on submit

    // Constructs a new comment object
    const newComment =
    {
        name: event.target.username.value,
        comment: event.target.comment.value,
    };

    // try to post comment through API, otherwise revert to old way
    try {
        await bandApiInstance.postComment(newComment);

    } catch (error) {
        console.log("Could not submit comments to API, adding directly to the page instead.",
            "\nNote the submitted comment will disappear on page refresh. Use for test purposes only.");
        // Get today's date and format it to MM/DD/YYYY to match existing comments
        const dateFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const today = new Date(Date.now()).toLocaleDateString(undefined, dateFormat);

        // Add new date property to new comment object, set to today
        newComment.date = today;

        //add new comment object as new comment
        comments.unshift(newComment); // adds to the start of the array
    }

    refreshComments(); // Re-renders to the page all comments from the comment array

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


/* -------------------------------------------------------------------------- */
/*                               Delete comment                               */
/* -------------------------------------------------------------------------- */

async function deleteComment(event) {
    try {
        await bandApiInstance.deleteComment(event.target.parentElement.id)
        refreshComments(); // Re-renders to the page all comments from the comment array

    } catch (error) {
        console.log("Could not delete comment", error)
    }
}


/* ----------------------------------------------------------------------- */
/*                               Like comment                              */
/* ----------------------------------------------------------------------- */


/* Add one like using comment API and then reflect it
eg. changing button name from "Like (0)" to "Like (1)" */

async function likeComment(event) {
    try {
        let commentId = '';

        // get id from parent or grandparent depending if click on span element instead of button directly
        if (event.target.localName == "span") {
            commentId = event.target.parentElement.parentElement.id;
        } else commentId = event.target.parentElement.id;

        // add like using comment API
        await bandApiInstance.likeComment(commentId);

        // Get the span element inside the button with id 'likeButton'
        let likeCount = document.querySelector(`[id='${commentId}'] .comments__button-like span`); // we use id=[] instead of # as id starting with number is valid html5 but not valid css
        // Extract the current count from the text content, remove parentheses and convert to integer
        let currentCount = parseInt(likeCount.textContent.slice(1, -1));

        // Increment the count by one
        let newCount = currentCount + 1;

        // Update the text content of the like count element with the new count
        likeCount.textContent = '(' + newCount + ')';

    } catch (error) {
        console.log("Could not like comment", error)
    }
}

/* -------------------------------------------------------- */
/*                   Get comments and display               */
/* -------------------------------------------------------- */

async function refreshComments() {
    // show list of existing comments at page load
    await displayComments()
}

refreshComments()