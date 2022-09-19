const scraper = require('./worker/page_scraper');
const browserObject = require('./worker/browser');
const scraperController = require('./worker/page_controller');

function xss_target (req, res) {

    if (!req.body.target) {
        return res.redirect('/error');
    }else{
        console.log('Ricevuto il target: ', req.body.target);
    }

    scraper.url = req.body.target;

    if (!scraper.url) {
        console.log('Target non ricevuto!')
        res.redirect('/error');
    } else {
        console.log('Target ricevuto correttamente!')
    }

    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();

    // Pass the browser instance to the scraper controller
    scraperController(browserInstance).then((data)=>{
        res.render('report', { data: data.report });
    }).catch((error)=>{
        res.redirect('/error');
    });

}

module.exports = {
    xss_target
}