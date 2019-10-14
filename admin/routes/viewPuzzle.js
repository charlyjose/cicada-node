const express = require('express');
const router = express.Router();
const transporter = require('../mailService');
const { signInAuth } = require('../middleware/signInAuth')

router.get('/', signInAuth, function (req, res, next) {
    res.render('viewpuzzle', {
        pageTitle: 'USN | Home',
        name: res.locals.Name,
        goBack: '0'
    });
});

router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});

module.exports = router;