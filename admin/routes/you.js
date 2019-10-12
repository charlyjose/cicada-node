var express = require('express');   //rqd
var router = express.Router();      //rqd
var db = require('../connectDB');   //rqd


router.get('/', function (req, res, next) {
   // Check if signed in
   if (req.session.email) {
    
    var sql = 'select name from user where email like ?';
    var values = [
        [req.session.email]
    ];
    db.query(sql, [values], function (err, results, fields) {
        if (err) {
            console.log('\n\nDB ERROR: ' + err);
        }
        else if (results.length === 0) {
            // session not set after signup or signin
            res.render('messageBoard', {
                title: 'USN | Error',
                heading: 'Ouch!',
                subtitle: 'Something went wrong on our side',
                body: 'Our engineers are looking into it, if you see them tell them code give below.',
                diagnose: 'Tip: Try another browser',
                comments: '1011011011100110110010101110011 1110011011010010110111101101110 1011111011011100110111101110100 1011111011100110110010101110100 1011101000000000000000000000000',
                returnLink: 'home'
              });
        }
        else {
            // Session set
            res.render('you', {
                name: results[0].name
            });
        }
    });
    
    
   
    }
   else {
       // Not signed in
       res.redirect('/signin');
   }
});

router.post('/', function (req, res, next) {
    // coming soon
    console.log('At you post');
});

module.exports = router;