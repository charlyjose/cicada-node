const express = require('express');
const router = express.Router();
const { signInAuth } = require('../middleware/signInAuth')

router.get('/', signInAuth, function (req, res, next) {
    console.log("\n\n")

    res.render('dashboard', {
        pageTitle: 'USN | Home',
        name: "Name",
        goBack: '0',

        level: '9',
        total: '58',
        puzzles: '12'
    });
});

router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});

module.exports = router;