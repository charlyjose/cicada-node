var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    // Check if signed in
    if (req.session.email) {
        res.render('reset-contacts');
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});


module.exports = router;