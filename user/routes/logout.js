var express = require('express');   //rqd
var router = express.Router();      //rqd


router.get('/', function(req, res, next) {
    // chk if session is set
    req.session.destroy(function(err) {
        if(err) {
            // res.negotiate(err);
            console.log('ERROR: ' + err);

            res.render('messageBoard', {
                title: 'USN | Error',
                heading: 'Ouch!',
                subtitle: 'Something went wrong on our side ?',
                body: 'Our engineers are looking into it, if you see them tell them code give below.',
                diagnose: '',
                comments: '1011011 1001100 1001111 1000111 1001111 1010101 1010100 100000 1000101 1010010 1010010 1001111 1010010 1011101',
                returnLink: 'logout'
            });

        }
        else {
            res.redirect('/');
        }
    });
});

module.exports = router;