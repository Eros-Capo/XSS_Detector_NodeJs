const contact_schema = require("../models/contact_schema");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

function get_contacts (req, res) {
    console.log('Ricevuto il target: ', req.body.email)
    // Salvataggio nel Database
    const contact = new contact_schema({
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        email: req.body.email,
        message: req.body.message
    });

    contact.save().then(data => {
        console.log({message: data})
    }).catch( err => {
        console.log({message: err});
    });

    if (!req.body.email) {
        return res.status(200).send({message: 'E-Mail non inserita!'})
    }

    let email = req.body.email

    if (!email) {
        console.log('E-Mail non ricevuta!')
        res.render("error")
    } else {
        console.log(req.body);
        console.log('E-Mail ricevuta correttamente!')
        res.render("thank_you")
    }

    // Invio mail
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.PW_MAIL
        }
    });

    var mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: 'anteros.capo@gmail.com',
        subject: 'You have a message from: ' + req.body.email,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = {
    get_contacts
}