var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    // Chk if logged in
    if(req.session.email){
        // find the corresponding user from the database
        res.redirect('/profile'); // actually /feeds
    }
    else {
        res.render('home');
    }
});

module.exports = router;