var express = require('express');               //rqd
var router = express.Router();                  //rqd
var db = require('../connectDB');               //rqd
var transporter = require('../mailService');    //rqd
var randomstring = require('randomstring');
var cryptoRandomString = require('crypto-random-string');


router.get('/', function (req, res, next) {
    // Check if signed in
    if (req.session.email) {
        res.render('reset-password');
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});


router.post('/', function (req, res, next) {
    // Check if signed in
    if (req.session.email) {

        if (!req.body.passwordold || !req.body.passwordnew1 || !req.body.passwordnew2) {
            res.render('messageBoard', {
                title: 'USN | Sign Up Error',
                heading: 'Sorry',
                subtitle: 'The account requirements are not satisfied.',
                body: 'Please provide all details.',
                diagnose: '',
                comments: '',
                returnLink: 'signup'
            });

            // res.send('sfm');
        }
        else {

            var sql = "select email, password from user where email = '" + req.session.email + "' and password = '" + req.body.passwordold + "'";

            db.query(sql, function (err, results, fields) {
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
                    // Session not set | No such user | Old password is wrong
                    res.render('messageBoard', {
                        title: 'USN | Error',
                        heading: 'Ouch!',
                        subtitle: 'Your old password wrong ? or something went wrong on our side ?',
                        body: 'Our engineers are looking into it, if you see them tell them code give below.',
                        diagnose: 'Tip: Try another browser',
                        comments: '1011011011100110110010101110011 1110011011010010110111101101110 1011111011011100110111101110100 1011111011100110110010101110100 1011101001000000111110001111100 100000010110110110111101101100 1100100010111110111000001100001 1110011011100110111011101101111 1110010011001000101111101110111 1110010011011110110111001100111 1011101000000000000000000000000',
                        returnLink: 'home'
                    });

                    // res.send('opw');
                }
                else {
                    // Session is set and user found in db

                    // Check if passwordnew1 and passwordnew2 are equal
                    if (req.body.passwordnew1 === req.body.passwordnew2) {
                        // Passwords are equal

                        // Check if old password = new password
                        if (results[0].password === req.body.passwordnew1) {
                            // New password required
                            res.render('messageBoard', {
                                title: 'USN | Error',
                                heading: 'Use new password',
                                subtitle: '',
                                body: '',
                                diagnose: 'Cannot use old password again.',
                                comments: '',
                                returnLink: '/reset-password'
                            });

                            // res.send('nwps');
                        }
                        else {
                            // Old password != new password



                            var email = req.session.email;
                            // Get collegeID

                            var sql = "select collegeID from user where email like ?";
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
                                else if (results.length === 0) {
                                    // Session not set | No such user | Old password is wrong
                                    res.render('messageBoard', {
                                        title: 'USN | Error',
                                        heading: 'Ouch!',
                                        subtitle: 'Your old password wrong ? or something went wrong on our side ?',
                                        body: 'Our engineers are looking into it, if you see them tell them code give below.',
                                        diagnose: 'Tip: Try another browser',
                                        comments: '1011011011100110110010101110011 1110011011010010110111101101110 1011111011011100110111101110100 1011111011100110110010101110100 1011101001000000111110001111100 100000010110110110111101101100 1100100010111110111000001100001 1110011011100110111011101101111 1110010011001000101111101110111 1110010011011110110111001100111 1011101000000000000000000000000',
                                        returnLink: 'home'
                                    });
                                }
                                else {
                                    // User found in DB
                                    var collegeID = results[0].collegeID;

                                    // Insert new password to into temp

                                    var sql = "insert into temp (collegeID, password) values ?";
                                    var values = [
                                        [collegeID, req.body.passwordnew1]
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
                                        else {
                                            // Generate and Email OTP


                                            // Generate OTP code
                                            var OTP = randomstring.generate({
                                                length: 5,
                                                charset: cryptoRandomString(9)
                                            });

                                            var sql = "insert into verify (collegeID, otp) values ?";
                                            var values = [
                                                [collegeID, OTP]
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
                                                else {
                                                    // Sent OTP to mail

                                                    // MAIL SERVICE
                                                    var html = "<body><p>To verify your identity, use the following code:</p><b><p>" + OTP + "</p></b><p>This OTP is confidential. For security reasons, DO NOT share this OTP with anyone.</p><p>USN takes your account security seriously. USN will never email you to disclose or verify your USN password. If you receive a suspicious email with a link to update your account information, do not click on the link--instead, report the email to USN for investigation.</p><p>We hope to see you again soon.</p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/password-assistance' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>You received this email to let you know about important changes to your USN Account and services.</p><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";

                                                    var mailOptions = {
                                                        from: 'usnrobot@gmail.com',
                                                        to: email,
                                                        subject: 'USN password assistance',
                                                        html: html
                                                    };

                                                    transporter.sendMail(mailOptions, function (error, info) {
                                                        if (error) {
                                                            console.log(error);
                                                        } else {
                                                            console.log('\nEmail sent: ' + info.response + '\n');
                                                        }
                                                    });

                                                    // Redirect to verify
                                                    res.send('done');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        // Passwords are wrong
                        res.redirect('/password-reset');
                    }
                }
            });
        }
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});

module.exports = router;