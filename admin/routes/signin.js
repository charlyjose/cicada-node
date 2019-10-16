const express = require('express');
const router = express.Router();
// const session = require('express-session')
const db = require('../connectDB');
const { signInAuth } = require('../middleware/signInAuth')


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
    res.redirect('dashboard');
});

router.post('/', function (req, res, next) {
    console.log("\n\n")

    if (!req.body.email || !req.body.password) {
        res.render('messageBoard', {
            title: 'USN | Sign In Error',
            heading: 'Sorry',
            subtitle: 'The account requirements are not satisfied.',
            body: 'Please provide all details.',
            diagnose: '',
            comments: '',
            returnLink: 'signin'
        });
    }
    else {

        // Check for user account
        var sql = 'select password from user where email like ?';
        var values = [
            [req.body.email]
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
                // No such user
                res.render('messageBoard', {
                    title: 'USN | Sign In Error',
                    heading: 'Sorry',
                    subtitle: 'The account requirements are not satisfied.',
                    body: 'Email ID or Password is wrong.',
                    diagnose: '',
                    comments: '',
                    returnLink: 'signin'
                });
            }
            else {
                // The user is registered in db
                // Check if password is correct
                if (results[0].password === req.body.password) {
                    // Set sessions
                    req.session.email = req.body.email;
                    req.session.password = req.body.password;
                    //session = req.session.email;

                    // console.log("\n\n\nSESSION ID  " + req.sessionID)

                    // next()
                    res.redirect('/dashboard');
                }
                else {
                    // Password is wrong
                    res.render('messageBoard', {
                        title: 'USN | Sign In Error',
                        heading: 'Sorry',
                        subtitle: 'The account requirements are not satisfied.',
                        body: 'Email ID or Password is wrong.',
                        diagnose: '',
                        comments: '',
                        returnLink: 'signin'
                    });
                }
            }
        });
    }



});


/*
router.post('/', function (req, res, next) {

    if (!req.body.email || !req.body.password) {
        res.render('messageBoard', {
            title: 'USN | Sign In Error',
            heading: 'Sorry',
            subtitle: 'The account requirements are not satisfied.',
            body: 'Please provide all details.',
            diagnose: '',
            comments: '',
            returnLink: 'signin'
        });
    }
    else {

        // Check for user account
        var sql = 'select password from user where email like ?';
        var values = [
            [req.body.email]
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
                // No such user
                res.render('messageBoard', {
                    title: 'USN | Sign In Error',
                    heading: 'Sorry',
                    subtitle: 'The account requirements are not satisfied.',
                    body: 'Email ID or Password is wrong.',
                    diagnose: '',
                    comments: '',
                    returnLink: 'signin'
                });
            }
            else {
                // The user is registered in db
                // Check if password is correct
                if (results[0].password === req.body.password) {
                    // Password is okay
                    // Set sessions
                    req.session.email = req.body.email;
                    req.session.password = req.body.password;
                    session = req.session.email;
                    res.redirect('/dashboard');
                }
                else {
                    // Password is wrong
                    res.render('messageBoard', {
                        title: 'USN | Sign In Error',
                        heading: 'Sorry',
                        subtitle: 'The account requirements are not satisfied.',
                        body: 'Email ID or Password is wrong.',
                        diagnose: '',
                        comments: '',
                        returnLink: 'signin'
                    });
                }
            }
        });
    }
});


*/



router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});

module.exports = router;