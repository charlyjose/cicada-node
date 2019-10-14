var express = require('express');
var router = express.Router();
var db = require('../connectDB');
var transporter = require('../mailService');


router.get('/', function (req, res, next) {


    // Check if signed in
    if (req.session.email) {

        var sql = 'select name, collegeID from user where email like ?';
        var values = [
            [req.session.email]
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
            else if (results.length == 0) {
                // Session deleted from db
                res.redirect('/signin');
            }
            else {
                // Session is set in db
                var Name = results[0].name;


                // Get avatar image
                var avatar = 'default/avatar-anonymous.png';

                var sql = 'select avatar from user where collegeID like ?';
                var values = [
                    [results[0].collegeID]
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

                    }
                    else {
                        avatar = results[0].avatar;
                    }
                });


               res.render('viewpuzzle', {
                pageTitle: 'USN | Home',
                name: "Name",
                goBack: '0'
            });

            // res.send("<h1>Dashboard is coming soon</h1>")
            }
        });
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});

router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});

module.exports = router;