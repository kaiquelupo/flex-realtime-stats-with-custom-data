const axios = require("axios");

const { ACCOUNT_SID, AUTH_TOKEN } = process.env;

//Get API endpoint page
var getEventsPage =  async (url, key, params) => {

    const result = await axios.get(url, { 
        params,
        auth: {
            username: ACCOUNT_SID,
            password: AUTH_TOKEN
        }
    });

    return {
        nextPageUrl : result.data.meta.next_page_url,
        pageEvents: result.data[key]
    }

}

//Get all pages from a API request
const get = async (url, key, params) => {

    let nextPageUrl = url;
    let page = 0;
    let events = [];

    while(nextPageUrl) {

        let pageEvents;

        ({ nextPageUrl, pageEvents } = await getEventsPage(nextPageUrl, key, params));

        page++;

        events = [...events, ...pageEvents];

        console.log(`(${page}) -> # of ${key}: ${events.length}`);

    }   

    return events;
}


module.exports = {
    get
}