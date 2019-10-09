var express = require('express');               //rqd
var router = express.Router();                  //rqd
var db = require('../connectDB');               //rqd
var transporter = require('../mailService');    //rqd
var datetime = require('node-datetime');
var randomstring = require('randomstring');
var cryptoRandomString = require('crypto-random-string');



router.get('/', function (req, res, next) {
    // Check if signed in
    if (req.session.email) {
        // Render verify
        res.render('verify');
    }
    else {
        // Not signed in
        res.redirect('/signin');
    }
});


router.post('/', function (req, res, next) {
    console.log("\n\n\nOTP: " + req.body.otp + "\n\n");


    // Check if signed in
    if (req.session.email) {

        if (!req.body.otp) {
            res.render('messageBoard', {
                title: 'USN | Sign Up Error',
                heading: 'Sorry',
                subtitle: 'The account requirements are not satisfied.',
                body: 'Please provide all details.',
                diagnose: '',
                comments: '',
                returnLink: 'signin'
            });
        }
        else {

            // Get collegeID

            var sql = "select collegeID from user where email like ?";
            var values = [
                [req.session.email]
            ];


            var email = req.session.email;


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
                    // No such user || user not signed in
                    res.redirect('/logout');
                }
                else {
                    // user in DB
                    var collegeID = results[0].collegeID;


                    var dt = datetime.create();
                    var formattedTime = dt.format('Y-m-d H:M:S');

                    var sql = "select subtime('" + formattedTime + "','0:5:0') as diff";


                    console.log("\n\nformattedTime :: " + formattedTime + "\n\n");

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
                            // CRITICAL ERROR
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

                            console.log("\n\nDIFFERD\n\n");
                            // Time returned
                            var sql = "select otp from verify where create_time >= '" + results[0].diff + "' and collegeID like '" + collegeID + "'";

                            console.log("\n\nresults[0].diff :: " + results[0].diff + "\n\n");
                            console.log("\n\ncollegeID :: " + collegeID + "\n\n");

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
                                    // OTP Timeout
                                    // res.render('messageBoard', {
                                    //     title: 'USN | OTP Timeout',
                                    //     heading: 'Ouch!',
                                    //     subtitle: 'Timeout',
                                    //     body: '',
                                    //     diagnose: '',
                                    //     comments: '',
                                    //     returnLink: 'logout'
                                    // });


                                    res.send('to');
                                }
                                else {

                                    console.log("\n\nDIFFERD IIID((\n\n");


                                    // Validate OTP
                                    if (results[0].otp === req.body.otp) {

                                        // OTP okay now change password
                                        console.log("\n\nDIFFERD 4 3535\n\n");

                                        // Get the new password from the temp table

                                        var sql = "select password from temp where collegeID like ?";
                                        var values = [
                                            [collegeID]
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
                                                // New password not entered correctly in db
                                                res.render('messageBoard', {
                                                    title: 'USN | Error',
                                                    heading: 'Ouch!',
                                                    subtitle: 'Something went wrong on our side ?',
                                                    body: 'Our engineers are looking into it, if you see them tell them code give below.',
                                                    diagnose: 'Password not changed',
                                                    comments: '',
                                                    returnLink: 'logout'
                                                });
                                            }
                                            else {
                                                // Now change the password, add entry to user table
                                                console.log("\n\nDIFFERD 34\n\n");

                                                var sql = "update user set password = '" + results[0].password + "' where collegeID = '" + collegeID + "'";

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
                                                    else {
                                                        // Password changed succesfully
                                                        console.log("\n\nDIFFERD 1111\n\n");

                                                        // Session destroyed
                                                        req.session.destroy(function (err) {
                                                            if (err) {
                                                                // res.negotiate(err);
                                                                console.log('ERROR: ' + err);
                                                            }
                                                            else {
                                                                //
                                                            }
                                                        });

                                                        // res.render('okay', {
                                                        //     title: 'USN | Password changed succesfully',
                                                        //     heading: 'Password changed succesfully',
                                                        //     subtitle: '',
                                                        //     body: '',
                                                        //     diagnose: '',
                                                        //     comments: '',
                                                        //     returnLink: '/logout'
                                                        // });


                                                        // Delete entry from verify
                                                        var sql = "delete from verify where collegeID like ?";
                                                        var values = [
                                                            [collegeID]
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
                                                                // Entry deleted
                                                                console.log("\n\nDIFFERD 22222\n\n");

                                                                // Delete entry from temp
                                                                var sql = "delete from temp where collegeID like ?";
                                                                var values = [
                                                                    [collegeID]
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
                                                                        // Entry deleted

                                                                        // MAIL SERVICE
                                                                        var html = "<body><h1>Your password has been changed</h1><p>Greetings from USN. Per your request, we have succesfully changed your password.</p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/password-assistance' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>You received this email to let you know about important changes to your USN Account and services.</p><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";

                                                                        var mailOptions = {
                                                                            from: 'usnrobot@gmail.com',
                                                                            to: email,
                                                                            subject: 'Revision to Your USN Account',
                                                                            //text: 'Your account\'s password has been changed'
                                                                            html: html
                                                                        };

                                                                        transporter.sendMail(mailOptions, function (error, info) {
                                                                            if (error) {
                                                                                console.log(error);
                                                                            } else {
                                                                                console.log('\nEmail sent: ' + info.response + '\n');
                                                                            }
                                                                        });

                                                                        res.send('done');
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        console.log("\n\nDIFFERD OIRDSIH\n\n");



                                        // Delete entry from verify
                                        var sql = "delete from verify where collegeID like ?";
                                        var values = [
                                            [collegeID]
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
                                                // Entry deleted
                                                console.log("\n\nDIFFERD 9475hdjk\n\n");

                                                // Delete entry from temp
                                                var sql = "delete from temp where collegeID like ?";
                                                var values = [
                                                    [collegeID]
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
                                                        // Entry deleted
                                                        console.log("\n\nDIFFERD BJD\n\n");

                                                        // Wrong OTP
                                                        // res.render('messageBoard', {
                                                        //     title: 'USN | OTP ERROR',
                                                        //     heading: 'Ouch!',
                                                        //     subtitle: 'The OTP you have entered is wrong',
                                                        //     body: '',
                                                        //     diagnose: '',
                                                        //     comments: '',
                                                        //     returnLink: 'logout'
                                                        // });

                                                         // Session destroyed
                                                         req.session.destroy(function (err) {
                                                            if (err) {
                                                                // res.negotiate(err);
                                                                console.log('ERROR: ' + err);
                                                            }
                                                            else {
                                                                //
                                                            }
                                                        });

                                                        res.send('w');
                                                        console.log("\n\nDIFFERD SF OI\n\n");





                                                        // MAIL SERVICE
                                                        var html = "<body><h1>Suspicious account activity detected</h1><p>Someone tried to change your account password. If this action was initiated by you, the OTP entered might be wrong.</p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/password-assistance' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>You received this email to let you know about important changes to your USN Account and services.</p><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";

                                                        var mailOptions = {
                                                            from: 'usnrobot@gmail.com',
                                                            to: email,
                                                            subject: 'Revision to Your USN Account',
                                                            //text: 'Your account\'s password has been changed'
                                                            html: html
                                                        };

                                                        transporter.sendMail(mailOptions, function (error, info) {
                                                            if (error) {
                                                                console.log(error);
                                                            } else {
                                                                console.log('\nEmail sent: ' + info.response + '\n');
                                                            }
                                                        });





                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
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