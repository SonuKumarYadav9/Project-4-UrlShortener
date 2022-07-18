const UrlModel = require("../Models/urlModels");


const urlCreate = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        let data = req.body;
        
        let createUrl = await UrlModel.create(data);
      
        res.status(201).send({ status: true, data: createUrl })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }

}


module.exports = {
    urlCreate
}