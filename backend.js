const express = require('express');
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//const MongoClient = require('mongodb').MongoClient;
const xss_controller = require("./controllers/xss_controller.js");
const contacts_controller = require("./controllers/contacts_controller");
const recent_scans_controller = require("./controllers/recent_scans_controller");

dotenv.config({ path: './config/config.env'})
var app = express();

// DB Connection
mongoose.connect(process.env.DB,{useNewUrlParser: true} ,()=>{console.log('Database connesso!')})

// App Configurations
app.set("view engine", "pug");
app.set("views", [path.join(__dirname, "public/template"), path.join(__dirname, "public/template/includes")]);
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/assets/images')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'reports')));
app.use(express.urlencoded({extended: true}));
app.use(express.json({ strict: false }))
app.use(express.urlencoded());


// GET
app.get('/', function(req,res){
    res.render("index");
});

app.get('/XSSDetector', function(req,res){
    res.render("xssdetector");
});

app.get('/RecentScans', function(req,res){
    res.render("recent_scans");
});

app.get('/AboutMe', function(req,res){
    res.render("about_me");
});

app.get('/Contacts', function(req,res){
    res.render("contacts");
});

app.get('/error', (req, res) => {
    res.render("error_page");
})

app.get('/reports/:report', (req, res) => {
    let filePath = req.url;

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

// POST
app.post('/xsstarget', xss_controller.xss_target)
app.post('/send_contact', contacts_controller.get_contacts)

// REST API
app.get("/api/analysis", recent_scans_controller.API)

// Clear DB
/*app.get('/clear', (req, res)=>{
    // Get id for naming pdf
    MongoClient.connect(process.env.DB, function(err, db) {
        if (err) throw err;
        xssdetector.deleteMany({}, function (err, _) {
            if (err) {
                return console.log(err);
            }
        });
        contact_schema.deleteMany({}, function (err, _) {
            if (err) {
                return console.log(err);
            }
        });
    });

    res.send('Done!')

})*/

app.listen(process.env.PORT,  () =>
    console.log('Server started!')
);