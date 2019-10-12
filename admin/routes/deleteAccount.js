var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    // Check if signed in
    if (req.session.email) {
        res.render('delete-account', {
            name: 'name'
        });
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});


// post function coming soon

module.exports = router;