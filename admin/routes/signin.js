const express = require('express');
const router = express.Router();
// const session = require('express-session')
const { signInAuth } = require('../middleware/signInAuth')
const { newLogin } = require('../middleware/newLogin')

router.get('/', function (req, res, next) {
    console.log("\n\n")

    if (!req.session.email) {
        res.render('signin');
        res.end;
    } else {
        next()
    }
});

router.get('/', signInAuth, function (req, res, next) {
    console.log("\n\n")
    res.redirect('dashboard');
});

router.post('/', newLogin, function (req, res, next) {
    console.log("\n\n")
    res.redirect('dashboard')
});

router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});

module.exports = router;