
class BandSiteApi {
    /* The constructor accepts an API key as its only parameter (e.g. apiKey). 
    This API key will be used when making POST and GET requests to the API (such as in the postComment and getComments methods). */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "ddhttps://unit-2-project-api-25c1595833b2.herokuapp.com";

    }
    async getShows() {
        const response = await axios.get(`${this.baseUrl}/showdates?api_key=${this.apiKey}`)
        return response.data;

        /* The getShows method must return the array of show data objects returned from the API. */
    }
    async getComments() {
        const response = await axios.get(`${this.baseUrl}/comments?api_key=${this.apiKey}`)
        return response.data.sort((a, b) => b.timestamp - a.timestamp); // returns most recent comments first

    }

    async postComment(comment) {
        const response = await axios.post(`${this.baseUrl}/comments?api_key=${this.apiKey}`, comment);
        return response.data;
    }
}

//Create API object 
const bandApiInstance = new BandSiteApi("3fae3964-9aa9-46ad-aaf7-ca017aa48826");

//export API object to use to interact with the API.
export default bandApiInstance;
