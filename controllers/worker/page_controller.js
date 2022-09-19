const pageScraper = require('./page_scraper');
async function scrapeAll(browserInstance){
    let browser;
    let data;
    try{
        browser = await browserInstance;
        data = await pageScraper.scraper(browser);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }

    return data;
}

module.exports = (browserInstance) => scrapeAll(browserInstance)