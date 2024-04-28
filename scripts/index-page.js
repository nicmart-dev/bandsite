import { addChildHTML, formatDate } from './utilities.js'
import bandApiInstance from './band-site-api.js'

let comments = []; // List of comments to display on bio page


/* -------------------------------------------------------------------------- */
/*                      Get existing comments from BandSite API                      */
/* -------------------------------------------------------------------------- */

async function getCommentsList() {
    try {
        const commentsList = await bandApiInstance.getComments();
        // Restructure to match existing comments array, removing id and likes properties
        let apiComments = commentsList.map(({ timestamp, ...rest }) => ({
            date: formatDate(timestamp, 'bio'), //format timestamp to date
            ...rest
        }));

        // Update the events array with the updated objects
        comments = apiComments;
    } catch (error) {
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
}


/* ------------------------------------------------------------------------- */
/*                          Display comments on page                         */
/* ------------------------------------------------------------------------- */

function displayComments() {

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


        //add Delete button and event listener
        const deleteBtn = addChildHTML(commentTxtContainer, 'button', 'comments__button', "Delete")
        deleteBtn.setAttribute("id", comment.id); // set comment id as button id to be able to delete it through event
        deleteBtn.addEventListener('click', deleteComment);


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
        await bandApiInstance.deleteComment(event.target.id)
        refreshComments(); // Re-renders to the page all comments from the comment array

    } catch (error) {
        console.log("Could not delete comment", error)
    }
}


/* -------------------------------------------------------- */
/*                   Get comments and display               */
/* -------------------------------------------------------- */

async function refreshComments() {
    // wait until we get results from API to update comments variable with
    await getCommentsList()

    // show list of existing comments at page load
    displayComments()
}

refreshComments()