const xssdetector = require("../models/xssdetector_schema");


async function API (req, res){
    const analysis = await xssdetector.find()
    res.send(analysis);
}

module.exports = {
    API
}