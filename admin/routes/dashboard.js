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






                // Coming Soon
                /*
                                // Get user details from details table
                                var sql = 'select avatar, summary, skills, contacts, education, accomplishments, interests from details where collegeID like ?'
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
                
                                        console.log("Here3");
                
                
                                        // Basics profile is not set
                                        if (skip === 0) {
                                            res.redirect('/you');
                                        }
                                        else if (skip == 1) {
                                            // Basics profile okay
                
                
                
                                            var email = req.session.email;
                
                                            // MAIL SERVICE
                                            var html = "<body><center><h1>Hi " + Name + ", </h1><h3>Your profile speaks</h3></center><br /><p>We have found that you haven't completed your profile. It just take only a minute.</p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/account' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>You received this email because you have <a href='https://usn-help.com/content' style='color: black'>subscribed</a> to our email assistance service.</p><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";
                
                                            var mailOptions = {
                                                from: 'usnrobot@gmail.com',
                                                to: email,
                                                subject: 'Complete you profile',
                                                html: html
                                            };
                
                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('\nEmail sent: ' + info.response + '\n');
                                                }
                                            });
                
                
                
                
                                            res.render('profile', {
                                                pageTitle: 'USN | Home',
                                                name: Name,
                                                address: 'Fill your details',
                                                avatar: 'usn_avatar_images/' + avatar,
                                                goBack: '0',
                
                                                connections: '240',
                                                onlineNow: '25',
                                                onlineToday: '172',
                
                                                newPosts: '43'
                
                                            });
                                        }
                                    }
                                    else {
                                        // Basics profile okay
                                        res.render('profile', {
                                            pageTitle: 'USN | Home',
                                            name: Name,
                                            goBack: '0',
                                            address: results[0].addressline1 + ', ' + results[0].addressline2 + ', ' + results[0].city,
                
                                            connections: '240',
                                            onlineNow: '25',
                                            onlineToday: '172',
                
                                            newPosts: '43'
                
                                        });
                                    }
                                });
                            
                                //
                */


                res.render('dashboard', {
                    pageTitle: 'USN | Home',
                    name: "Name",
                    goBack: '0',

                    level: '9',
                    total: '58',
                    puzzles: '12'
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