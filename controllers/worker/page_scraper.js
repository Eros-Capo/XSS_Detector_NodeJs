const PDFDocument = require('pdfkit');
const fs = require('fs');
const dotenv = require("dotenv");
const xssdetector_schema = require("../../models/xssdetector_schema");

dotenv.config({ path: './config/config.env'})

const scraperObject = {
    url: '.',
    async scraper(browser){
        let page = await browser.newPage();
        const sources_regex = new Array('document.URL', 'document.documentURI', 'document.URLUnencoded', 'document.baseURI', 'location', 'document.cookie', 'document.referrer', 'window.name', 'history.pushState', 'history.replaceState', 'localStorage', 'sessionStorage');
        const sinks_regex = new Array('document.write', 'window.location', 'document.cookie', 'eval\\(', 'document.domain', 'WebSocket', 'element.src', 'postMessage', 'setRequestHeader', 'FileReader.readAsText', 'ExecuteSql', 'sessionStorage.setItem', 'document.evaluate', 'JSON.parse', 'element.setAttribute', 'RegExp');
        let sources = [];
        let sinks = [];
        let count_sources = 0;
        let count_sinks = 0;

        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        const bodyHandle = await page.$('body');
        const html = await page.evaluate(body => body.innerHTML, bodyHandle);
        let DOM = html.replace(/^\s*\n/gm, "").split(/\r?\n/);

        console.log('Searching for sources...');
        DOM.forEach((DOMelement)=>{
            sources_regex.forEach((el)=>{
                if (DOMelement.search(el) !== -1){
                    let line = DOMelement.search(el);
                    console.log("Found a DOM Based XSS source at line: " + line + ", below you can find the line in witch it's present!");
                    console.log(DOMelement);
                    sources.push({number: count_sources, line: DOMelement, line_number: line, vulnerability: el});
                    count_sources++;
                }
            });
        });

        console.log('Searching for sinks...');
        DOM.forEach((DOMelement)=>{
            sinks_regex.forEach((el)=>{
                if (DOMelement.search(el) !== -1){
                    let line = DOMelement.search(el);
                    console.log("Found a DOM Based XSS sink at line: " + line + ", below you can find the line in witch it's present!");
                    console.log(DOMelement);
                    sinks.push({number: count_sinks, line: DOMelement, line_number: line, vulnerability: el});
                    count_sinks++;
                }
            })
        });

        let path = './reports';

        // To check if the given directory already exists or not
        fs.access(path, (error) => {
            if (error) {
                // If current directory does not exist then create it
                fs.mkdir(path, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("New Directory created successfully !!");
                    }
                });
            } else {
                console.log("Given Directory already exists !!");
            }
        });

        // Create a document
        const doc = new PDFDocument();
        let pdf_name = new Date().getDate() + '' + new Date().getTime();

        // Saving the pdf file in root directory.
        doc.pipe(fs.createWriteStream('./reports/'+pdf_name+'.pdf')).on('finish', function () {
            console.log('PDF created!');
        });

        // Adding functionality
        doc.fontSize(27).text('DOM Based XSS Vulnerabilities found', 100, 100);
        doc.moveDown();
        doc.moveDown();

        doc.fontSize(18).text('DOM Based XSS Sources found:');

        sources.forEach(function(el){
            doc.fontSize(13).text("Numero vulnerabilità: "+ el.number);
            doc.fontSize(13).text("     Rinvenuta alla linea: " + el.line_number);
            doc.fontSize(13).text("     Vulnerabilità rinvenuta: " + el.vulnerability);
            doc.fontSize(13).text("     Stampa della linea: " + el.line);
            doc.moveDown();// should create a new line
        });

        doc.fontSize(18).text('DOM Based XSS Sinks found:');
        sinks.forEach(function(el){
            doc.fontSize(13).text("Numero vulnerabilità: "+ el.number);
            doc.fontSize(13).text("     Rinvenuta alla linea: " + el.line_number);
            doc.fontSize(13).text("     Vulnerabilità rinvenuta: " + el.vulnerability);
            doc.fontSize(13).text("     Stampa della linea: " + el.line);
            doc.fontSize(16).text();
            doc.moveDown();// should create a new line
        });

        // Finalize PDF file
        doc.end();

        let sources_number = sources.length;
        let sinks_number = sinks.length;
        let status = false;

        if (sources_number > 0 || sinks_number > 0){
            status = true;
        }
        // Salvataggio nel Database
        let attack_data = {
            url: this.url,
            sources: sources,
            sinks: sinks,
            sources_number: sources_number,
            sinks_number: sinks_number,
            report: pdf_name+'.pdf',
            status: status
        }

        console.log("Salvataggio nel database...");
        const xssdetector = new xssdetector_schema(attack_data);
        console.log("Salvato url nel database!");

        xssdetector.save().then(data => {
            //console.log({message: data})
        }).catch( err => {
            console.log({message: err});
        });

        return attack_data;
    }
}

module.exports = scraperObject;