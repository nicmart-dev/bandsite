
class BandSiteApi {
    /* The constructor accepts an API key as its only parameter (e.g. apiKey). 
    This API key will be used when making POST and GET requests to the API (such as in the postComment and getComments methods). */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://unit-2-project-api-25c1595833b2.herokuapp.com";

    }
    async getShows() {
        try {
            const response = await axios.get(`${this.baseUrl}/showdates?api_key=${this.apiKey}`)
            return response.data;

            /* The getShows method must return the array of show data objects returned from the API. */

        } catch (error) {
            console.log(error);
        }
    }
    async getComments() {
        try {
            const response = await axios.get(`${this.baseUrl}/comments?api_key=${this.apiKey}`)
            return response.data.sort((a, b) => b.timestamp - a.timestamp);

            /* The getComments method must sort the array of comments from the API, returning them in order from newest to oldest. */



        } catch (error) {
            console.log(error);
        }
    }

    async postComments(comment) {

        /* comment object parameter expected format is:
        {
            "name": "Nigel",
            "comment": "What a great band."
        } */

        // Turn comment oject into JSON string to API
        let raw = JSON.stringify(comment);

        // Define the data you want to send in the POST request
        const postData = {
            body: 'raw'
        };
        try {
            const response = await axios.post(`${this.baseUrl}/comments?api_key=${this.apiKey}`, postData)
            return response.data;

        } catch (error) {
            console.log(error);
        }
    }
}

//Create API object 
const bandApiInstance = new BandSiteApi("3fae3964-9aa9-46ad-aaf7-ca017aa48826");

//export API object to use to interact with the API.
export default bandApiInstance;
