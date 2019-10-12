var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();


router.get('/', function(req, res, next) {
    res.sendFile('/images/favicon.ico');

    res.end();
});

module.exports = router;