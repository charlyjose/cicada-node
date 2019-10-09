var express = require('express');   //rqd
var router = express.Router();      //rqd
var db = require('../connectDB');   //rqd
var path = require('path');
var multer = require('multer');
var randomstring = require('randomstring');
var cryptoRandomString = require('crypto-random-string');
var transporter = require('../mailService');    //rqd


// Posts image store directory
var DIR = path.join(__dirname, '../views/usn_posts_images');

var IMAGENAME = "";
var data = 0;
var imageFile = "";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {

        // var RAND = randomstring.generate({
        //     length: 6,
        //     charset: file.originalname
        // });

        var RAND = cryptoRandomString(10);

        var DATE = Date.now();
        IMAGENAME = RAND + '-' + DATE + '-' + file.originalname;
        cb(null, IMAGENAME)
    }
})

var uploading = multer({ storage: storage }).single('postImage');



router.get('/', function (req, res, next) {

    // Check if signed in
    if (req.session.email) {

        var sql = 'select name from user where email like ?';
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
                res.render('writepost', {
                    pageTitle: 'USN | Write Post',
                    name: Name,
                    goBack: '1',
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

    uploading(req, res, function (err) {
        if (err) {
            console.log(err);
        }

        imageFile = IMAGENAME;
        data = 0;
        if (imageFile === "") {
            data = 1
        }
        else {
            data = 4;
        }

        IMAGENAME = "";

        // Check if signed in
        if (req.session.email) {
            if (!req.body.postTitle || !req.body.postBody) {
                res.render('messageBoard', {
                    title: 'USN | Post not send',
                    heading: 'Sorry',
                    subtitle: 'One or more fields are not filled',
                    body: 'Post title and post body are required.',
                    diagnose: '',
                    comments: '',
                    returnLink: 'writepost'
                });
            }
            else {
                // get college ID
                var sql = 'select collegeID from user where email like ?';
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
                        // No such collegeID
                        // Session not set | No such user
                        res.render('messageBoard', {
                            title: 'USN | Error',
                            heading: 'Ouch!',
                            subtitle: 'Something went wrong on our side ?',
                            body: 'Our engineers are looking into it, if you see them tell them code give below.',
                            diagnose: 'Tip: Try another browser',
                            comments: '1011011011100110110010101110011 1110011011010010110111101101110 1011111011011100110111101110100 1011111011100110110010101110100 1011101001000000111110001111100 100000010110110110111101101100 1100100010111110111000001100001 1110011011100110111011101101111 1110010011001000101111101110111 1110010011011110110111001100111 1011101000000000000000000000000',
                            returnLink: 'home'
                        });
                    }
                    else {
                        // College ID present
                        var CollegeID = results[0].collegeID;


                        let posts = {
                            collegeID: CollegeID,
                            parent: CollegeID,
                            data: data,
                            postTitle: req.body.postTitle,
                            postBody: req.body.postBody,
                            imageFile: imageFile
                        };

                        let POST = JSON.stringify(posts);
                        console.log(POST);


                        var post_link = randomstring.generate({
                            length: 10,
                            charset: cryptoRandomString(9)
                        });

                        post_link = post_link + cryptoRandomString(20);
                        

                        // Save post to db
                        var sql = 'insert into posts(post_link, likes, views, shares, edit, content) values ?';
                        var values = [
                            [post_link, 0, 0, 0, 0, POST]
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
                                // Post added successfully

                                    var email = req.session.email;
                                
                                        // MAIL SERVICE
                                        var html = "<body><center><h1>Thank you for using our service</h1><h2></h2></center><p>Greetings from USN. Your new post is live at this <a href='https://usn.in/feeds/posts/" + post_link  + "' style='text-decoration: none;'>link</a></p><br /><p>For any queries related to your account visit this <a href='https://usn-help.com/content' style='text-decoration: none;'>link</a>, we always love to help you.</p><p>Cheers, </p><p>The USN Team</p><br /><br /><center><p>You received this email because you have <a href='https://usn-help.com/content' style='color: black'>subscribed</a> to our email assistance service.</p><p>&copy; 2019 USN Ltd, 2520 Beehumber Bay, Chetskar County, Kadtle 4534, IN </p></center></body>";

                                        var mailOptions = {
                                            from: 'usnrobot@gmail.com',
                                            to: email,
                                            subject: 'Your new post is live',
                                            html: html
                                        };

                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('\nEmail sent: ' + info.response + '\n');
                                            }
                                        });



                                res.render('okay', {
                                    title: 'USN | Post added successfully',
                                    heading: '',
                                    subtitle: ' ',
                                    body: '',
                                    diagnose: '',
                                    comments: '',
                                    returnLink: '/profile'
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
});



router.get('/favicon.ico', function (req, res, next) {
    res.sendFile('/images/favicon.ico');
});



module.exports = router;