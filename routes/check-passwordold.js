var express = require('express');   //rqd
var router = express.Router();      //rqd
var db = require('../connectDB');   //rqd


router.post('/', function (req, res, next) {


    if (req.session.email) {
        var sql = 'select email, password from user where password like ?';
        var values = [
            [req.body.passwordold]
        ];
        db.query(sql, [values], function (err, results, fields) {
            if (err) {
                // DB ERROR
                console.log('\n\nDB ERROR: ' + err);
        
                res.render('messageBoard', {
                    title: 'USN | Error',
                    heading: 'Ouch!',
                    subtitle: 'Something went wrong on our side ?',
                    body: 'Our engineers are looking into it, if you see them tell them code give below.',
                    diagnose: '',
                    comments: '1011011 1000100 1000001 1010100 1000001 1000010 1000001 1010011 1000101 100000 1000101 1010010 1010010 1001111 1010010 1011101',
                    returnLink: 'logout'
                });
            }
            else if (results.length === 0) {
                // Password is wrong
                res.send('sorry');
            }
            else {
                res.send('okay');
            }
        });
    }
    else {
        res.render('sign-in');
    }
});

module.exports = router;