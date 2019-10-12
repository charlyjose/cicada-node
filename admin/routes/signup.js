var express = require('express');
var router = express.Router();
var db = require('../connectDB');
var transporter = require('../mailService');



router.get('/', function (req, res, next) {

    console.log("\nSIGNUP GET\n---")

    if (req.session.email) {
        // get information from database for the logged in user
        res.redirect('/profile'); //feeds actually
    }
    else {
        res.render('sign-up');
    }
});


router.post('/', function (req, res, next) {

    console.log("\nSIGNUP POST\n---")

    console.log(req.body.name + " : " + req.body.email + " : " + req.body.password + " : " + req.body.confirmPassword + " : " + req.body.collegeID);



    if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.collegeID) {
        res.render('messageBoard', {
            title: 'USN | Sign Up Error',
            heading: 'Sorry',
            subtitle: 'The account requirements are not satisfied.',
            body: 'Please provide all details.',
            diagnose: '',
            comments: '',
            returnLink: 'signup'
        });
    }
    else {
        var session;
        var sendConfirm = '';

        /*
        // Server side validation
        req.check('name', 'Name should contain 4 letters').isLength({ min: 3 });
        req.check('email', 'Invalid Email Address').isEmail();
        req.check('password', 'Password doesn\'t match').isLength({ min: 4 }).equals(req.body.confirmPassword);
        req.check('collegeID', 'Invalid College ID').isLength({ min: 10 }).equals(req.body.confirmCollegeID);

        var errors = req.validationErrors();
        if (errors) {
            req.session.errors = errors;
            req.session.success = false;
        }
        else {
            req.session.errors = null;
            req.session.success = true;
        }
        */


// check if Email ID is taken
        var sql = 'select email from user where email like ?';
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
// Email ID is okay
// check if College ID is taken
                var sql = 'select collegeID from user where collegeID like ?';
                var values = [
                    [req.body.collegeID]
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
// College ID is okay
// Set sessions
                        req.session.email = req.body.email;
                        req.session.password = req.body.password;
                        // session = req.session.email;

                        // var avatar = 'default/avatar-anonymous.png';

                        // if (req.body.gender == 3) {
                        //     avatar = 'default/avatar-female.png';
                        // }
                        // else if (req.body.gender == 2) {
                        //     avatar = 'default/avatar-male.png';
                        // }
                        // else if (req.body.gender == 1) {
                        //     avatar = 'default/avatar-other.png';
                        // }
                        // else if (req.body.gender == 0) {
                        //     avatar = 'default/avatar-anonymous.png';
                        // }

                        console.log("Here")
// Creating user account
                        var sql = 'insert into user (name, email, collegeID, password) values ?';
                        var values = [
                            [req.body.name, req.body.email, req.body.collegeID, req.body.password]
                        ];

                        var name = req.body.name;
                        var email = req.body.email;

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
                            else {
// Account creation successful
// MAIL SERVICE
                                var html = "<body><center><h1>Hi " + name + " ,</h1><h1>Welcome to University Social Network</h1><h2>Build for students, built by students, nothing more nothing less.</h2></center><p>Greetings from USN. Your account has been successfully created!</p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/new' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";

                                var mailOptions = {
                                    from: 'usnrobot@gmail.com',
                                    to: email,
                                    subject: name + ', welcome to your new USN Account',
                                    html: html
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('\nEmail sent: ' + info.response + '\n');
                                    }
                                });


                                sendConfirm += "done";
                                res.send(sendConfirm);
                                // res.redirect('/profile');
                            }
                        });
                    }
                    else {
                        // College ID is taken
                        sendConfirm += "c";
                        res.send(sendConfirm);
                        // res.render('sign-up');
                    }
                });
            }
            else {
                // Email ID is taken
                sendConfirm += "e";
                res.send(sendConfirm);
                // res.render('sign-up');
            }
        });
    }
});


router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});


module.exports = router;