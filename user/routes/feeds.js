var express = require('express');   //rqd
var router = express.Router();      //rqd
var db = require('../connectDB');   //rqd

// select u.name, u.uname, u.avatar, p.likes, p.views, p.shares, p.edit, p.content, p.edit_time from user as u, posts as p where p.content->>'$.collegeID' = u.collegeID limit 4;


var author1 = 'Unknown';
var authorProfile1 = 'error';
var avatarImage1 = 'default/avatar-anonymous.png';

var postTitle1 = '';
var postBody1 = '';
var postImage1 = '';


var author2 = 'Unknown';
var authorProfile2 = 'error';
var avatarImage2 = 'default/avatar-anonymous.png';

var postTitle2 = '';
var postBody2 = '';
var postImage2 = '';


var author3 = 'Unknown';
var authorProfile3 = 'error';
var avatarImage3 = 'default/avatar-anonymous.png';

var postTitle3 = '';
var postBody3 = '';
var postImage3 = '';


var author4 = 'Unknown';
var authorProfile4 = 'error';
var avatarImage4 = 'default/avatar-anonymous.png';

var postTitle4 = '';
var postBody4 = '';
var postImage4 = '';







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

                        // Render here


        var sql = 'select u.name, u.uname, u.avatar, p.likes, p.views, p.shares, p.edit, p.content, p.edit_time from user as u, posts as p where p.content->>"$.collegeID" = u.collegeID limit 1';
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
                // No Post(s)
                res.render('feeds', {
                    pageTitle: 'USN | Feeds',
                    name: Name,
                    avatar: 'usn_avatar_images/' + avatar
                });
            }
            else if (results.length === 1) {
                // 1 Post(s) in DB
    
                var content = JSON.parse(results[0].content);
    
                // console.log("\n\n" + results[0].name + " :: " + results[0].uname + " :: " + results[0].avatar + "\n\n");
    
                author1 = results[0].name;
                authorProfile1 = results[0].uname;
                avatarImage1 = results[0].avatar;
    
    
                // console.log("\n\n" + author1 + " :: " + authorProfile1 + " :: " + avatarImage1 + "\n\n");
    
    
                // var content = results[0].content;
                var DATA = content["data"];
    
                if (DATA == 4) {
                    // Feeds image and text
                    postTitle1 = content["postTitle"];
                    postBody1 = content["postBody"];
                    postImage1 = content["imageFile"];
                }
    
                else if (DATA == 1) {
                    // Feeds text only
                    postTitle1 = content["postTitle"];
                    postBody1 = content["postBody"];
                    postImage1 = "";
                }
    
                res.render('feeds1', {
                    pageTitle: 'USN | Feeds',
                    name: Name,
                    avatar: 'usn_avatar_images/' + avatar,

                    author1: author1,
                    authorProfile1: '/u/' + authorProfile1,
                    avatarImage1: 'usn_avatar_images/' + avatarImage1,
                    postImage1: '../usn_posts_images/' + postImage1,
                    postTitle1: postTitle1,
                    postBody1: postBody1,
                    likes1: '12',
                    views1: '344',
                    circulations1: '24'
    
                });
    
            }
            else if (results.length === 2) {
                // 2 Post(s)
    
                for (var i = 0; i < results.length; ++i) {
                    // Fill user details for each post
    
    
                    var content = JSON.parse(results[i].content);
    
                    // User in DB
    
                    if (i == 0) {
    
                        author1 = results[i].name;
                        authorProfile1 = results[i].uname;
                        avatarImage1 = results[i].avatar;
    
                        // var content = results[0].content;
                        var DATA = content["data"];
    
                        if (DATA == 4) {
                            // Feeds image and text
                            postTitle1 = content["postTitle"];
                            postBody1 = content["postBody"];
                            postImage1 = content["imageFile"];
                        }
    
                        else if (DATA == 1) {
                            // Feeds text only
                            postTitle1 = content["postTitle"];
                            postBody1 = content["postBody"];
                            postImage1 = "";
                        }
                    }
    
    
                    if (i == 1) {
    
                        author2 = results[0].name;
                        authorProfile2 = results[0].uname;
                        avatarImage2 = results[0].avatar;
    
    
                        // var content = results[0].content;
                        var DATA = content["data"];
    
                        if (DATA == 4) {
                            // Feeds image and text
                            postTitle2 = content["postTitle"];
                            postBody2 = content["postBody"];
                            postImage2 = content["imageFile"];
                        }
    
                        else if (DATA == 1) {
                            // Feeds text only
                            postTitle2 = content["postTitle"];
                            postBody2 = content["postBody"];
                            postImage2 = "";
                        }
    
    
                    }

                    res.render('feeds2', {
                        pageTitle: 'USN | Feeds',
                        name: Name,
                        avatar: 'usn_avatar_images/' + avatar,
                        
                        author1: author1,
                        authorProfile1: '/u/' + authorProfile1,
                        avatarImage1: 'usn_avatar_images/' + avatarImage1,
                        postImage1: '../usn_posts_images/' + postImage1,
                        postTitle1: postTitle1,
                        postBody1: postBody1,
                        likes1: '12',
                        views1: '344',
                        circulations1: '24',
    
                        author2: author2,
                        authorProfile2: '/u/' + authorProfile2,
                        avatarImage2: 'usn_avatar_images/' + avatarImage2,
                        postImage2: '../usn_posts_images/' + postImage2,
                        postTitle2: postTitle2,
                        postBody2: postBody2,
                        likes2: '12',
                        views2: '344',
                        circulations2: '24'
    
                    });
                }
            }
            
        });
    











                    }
                });
                
            
                }
            });












    }


    else {
        // Not signed in
        res.redirect('/signin');
    }





});








































//same for POST requests - notice, how the AJAX request above was defined as POST 
router.post('/', function (req, res) {



    console.log("\n\nERRSORS  1 :::::\n\n\n");
    // // res.setHeader('Content-Type', 'application/json');

    // //content generated here
    // var some_json = {
    //     Title: "Test",
    //     Item: "Crate"
    // };

    // var result = JSON.stringify(some_json);

    // //content got 'client.jade'
    // var sent_data = req.body;
    // sent_data.Nick = "ttony33";
    // var html = "<br /><p><a href='1'>fdsjlfjslk fsklj</a></p>";


    var sql = 'select u.name, u.uname, u.avatar, p.likes, p.views, p.shares, p.edit, p.content, p.edit_time from user as u, posts as p where p.content->>"$.collegeID" = u.collegeID limit 4';
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
            // No Post(s)
            res.render('feeds-posts', {});
            console.log("\n\nERRSORS  2  :::::\n\n\n");

        }
        else if (results.length === 1) {
            // 1 Post(s) in DB
            console.log("\n\nERRSORS  3  :::::\n\n\n");

            var content = JSON.parse(results[0].content);

            // console.log("\n\n" + results[0].name + " :: " + results[0].uname + " :: " + results[0].avatar + "\n\n");

            author1 = results[0].name;
            authorProfile1 = results[0].uname;
            avatarImage1 = results[0].avatar;


            // console.log("\n\n" + author1 + " :: " + authorProfile1 + " :: " + avatarImage1 + "\n\n");


            // var content = results[0].content;
            var DATA = content["data"];

            if (DATA == 4) {
                // Feeds image and text
                postTitle1 = content["postTitle"];
                postBody1 = content["postBody"];
                postImage1 = content["imageFile"];
            }

            else if (DATA == 1) {
                // Feeds text only
                postTitle1 = content["postTitle"];
                postBody1 = content["postBody"];
                postImage1 = "";
            }

            res.render('feeds-posts1', {
                author1: author1,
                authorProfile1: '/u/' + authorProfile1,
                avatarImage1: 'usn_avatar_images/' + avatarImage1,
                postImage1: '../usn_posts_images/' + postImage1,
                postTitle1: postTitle1,
                postBody1: postBody1,
                likes1: '12',
                views1: '344',
                circulations1: '24'

            });
            console.log("\n\nERRSORS   4   :::::\n\n\n");

        }
        else if (results.length === 2) {
            // 2 Post(s)
            console.log("\n\nERRSORS   5   :::::\n\n\n");


            for (var i = 0; i < results.length; ++i) {
                // Fill user details for each post


                var content = JSON.parse(results[i].content);

                // User in DB

                if (i == 0) {

                    author1 = results[i].name;
                    authorProfile1 = results[i].uname;
                    avatarImage1 = results[i].avatar;

                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = "";
                    }
                }


                if (i == 1) {

                    author2 = results[0].name;
                    authorProfile2 = results[0].uname;
                    avatarImage2 = results[0].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = "";
                    }


                }


                res.render('feeds-posts2', {
                    author1: author1,
                    authorProfile1: '/u/' + authorProfile1,
                    avatarImage1: 'usn_avatar_images/' + avatarImage1,
                    postImage1: '../usn_posts_images/' + postImage1,
                    postTitle1: postTitle1,
                    postBody1: postBody1,
                    likes1: '12',
                    views1: '344',
                    circulations1: '24',

                    author2: author2,
                    authorProfile2: '/u/' + authorProfile2,
                    avatarImage2: 'usn_avatar_images/' + avatarImage2,
                    postImage2: '../usn_posts_images/' + postImage2,
                    postTitle2: postTitle2,
                    postBody2: postBody2,
                    likes2: '12',
                    views2: '344',
                    circulations2: '24'

                });
            }

            console.log("\n\nERRSORS   5   :::::\n\n\n");

        }
        else if (results.length === 3) {
            // 3 Post(s)
            console.log("\n\nERRSORS    6  :::::\n\n\n");


            for (var i = 0; i < results.length; ++i) {
                // Fill user details for each post

                var content = JSON.parse(results[i].content);

                // User in DB

                if (i == 0) {

                    console.log("\n\n\nUNKOENS");
                    author1 = results[i].name
                    authorProfile1 = results[i].uname;
                    avatarImage1 = results[i].avatar;

                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = "";
                    }
                }


                if (i == 1) {

                    author2 = results[i].name;
                    authorProfile2 = results[i].uname;
                    avatarImage2 = results[i].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = "";
                    }

                }


                if (i == 2) {

                    author3 = results[i].name;
                    authorProfile3 = results[i].uname;
                    avatarImage3 = results[i].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle3 = content["postTitle"];
                        postBody3 = content["postBody"];
                        postImage3 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle3 = content["postTitle"];
                        postBody3 = content["postBody"];
                        postImage3 = "";
                    }

                }


                res.render('feeds-posts3', {
                    author1: author1,
                    authorProfile1: '/u/' + authorProfile1,
                    avatarImage1: 'usn_avatar_images/' + avatarImage1,
                    postImage1: '../usn_posts_images/' + postImage1,
                    postTitle1: postTitle1,
                    postBody1: postBody1,
                    likes1: '12',
                    views1: '344',
                    circulations1: '24',

                    author2: author2,
                    authorProfile2: '/u/' + authorProfile2,
                    avatarImage2: 'usn_avatar_images/' + avatarImage2,
                    postImage2: '../usn_posts_images/' + postImage2,
                    postTitle2: postTitle2,
                    postBody2: postBody2,
                    likes2: '12',
                    views2: '344',
                    circulations2: '24',

                    author3: author3,
                    authorProfile3: '/u/' + authorProfile3,
                    avatarImage3: 'usn_avatar_images/' + avatarImage3,
                    postImage3: '../usn_posts_images/' + postImage3,
                    postTitle3: postTitle3,
                    postBody3: postBody3,
                    likes3: '12',
                    views3: '344',
                    circulations3: '24'

                });
            }

            console.log("\n\nERRSORS    7   :::::\n\n\n");

        }

        else if (results.length === 4) {
            // 4 Post(s)

            console.log("\n\nERRSORS    8   :::::\n\n\n");


            for (var i = 0; i < results.length; ++i) {
                // Fill user details for each post

                var content = JSON.parse(results[i].content);

                // User in DB

                if (i == 0) {

                    author1 = results[i].name;
                    authorProfile1 = results[i].uname;
                    avatarImage1 = results[i].avatar;

                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle1 = content["postTitle"];
                        postBody1 = content["postBody"];
                        postImage1 = "";
                    }
                }


                if (i == 1) {

                    author2 = results[i].name;
                    authorProfile2 = results[i].uname;
                    avatarImage2 = results[i].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle2 = content["postTitle"];
                        postBody2 = content["postBody"];
                        postImage2 = "";
                    }

                }


                if (i == 2) {

                    author3 = results[i].name;
                    authorProfile3 = results[i].uname;
                    avatarImage3 = results[i].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle3 = content["postTitle"];
                        postBody3 = content["postBody"];
                        postImage3 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle3 = content["postTitle"];
                        postBody3 = content["postBody"];
                        postImage3 = "";
                    }

                }


                if (i == 3) {

                    author4 = results[i].name;
                    authorProfile4 = results[i].uname;
                    avatarImage4 = results[i].avatar;


                    // var content = results[0].content;
                    var DATA = content["data"];

                    if (DATA == 4) {
                        // Feeds image and text
                        postTitle4 = content["postTitle"];
                        postBody4 = content["postBody"];
                        postImage4 = content["imageFile"];
                    }

                    else if (DATA == 1) {
                        // Feeds text only
                        postTitle4 = content["postTitle"];
                        postBody4 = content["postBody"];
                        postImage4 = "";
                    }

                }

                res.render('feeds-posts4', {
                    author1: author1,
                    authorProfile1: '/u/' + authorProfile1,
                    avatarImage1: 'usn_avatar_images/' + avatarImage1,
                    postImage1: '../usn_posts_images/' + postImage1,
                    postTitle1: postTitle1,
                    postBody1: postBody1,
                    likes1: '12',
                    views1: '344',
                    circulations1: '24',

                    author2: author2,
                    authorProfile2: '/u/' + authorProfile2,
                    avatarImage2: 'usn_avatar_images/' + avatarImage2,
                    postImage2: '../usn_posts_images/' + postImage2,
                    postTitle2: postTitle2,
                    postBody2: postBody2,
                    likes2: '12',
                    views2: '344',
                    circulations2: '24',

                    author3: author3,
                    authorProfile3: '/u/' + authorProfile3,
                    avatarImage3: 'usn_avatar_images/' + avatarImage3,
                    postImage3: '../usn_posts_images/' + postImage3,
                    postTitle3: postTitle3,
                    postBody3: postBody3,
                    likes3: '12',
                    views3: '344',
                    circulations3: '24',

                    author4: author4,
                    authorProfile4: '/u/' + authorProfile4,
                    avatarImage4: 'usn_avatar_images/' + avatarImage4,
                    postImage4: '../usn_posts_images/' + postImage4,
                    postTitle4: postTitle4,
                    postBody4: postBody4,
                    likes4: '12',
                    views4: '344',
                    circulations4: '24'

                });
            }

            console.log("\n\nERRSORS    9   :::::\n\n\n");



        }
    });






    //res.end();
});



module.exports = router;