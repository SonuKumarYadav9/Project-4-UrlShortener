const express = require('express');
const router = express.Router();

const urlController= require("../Controllers/urlController")

let {createUrl,getUrl} = urlController

router.post('/url/shorten',createUrl)
router.get('/:urlCode',getUrl)

module.exports = router;