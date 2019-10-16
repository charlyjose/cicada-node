const db = require('../connectDB');
const { Error } = require('../middleware/Error')

// function Error(res, Title, Heading, Subtitle, Body, Diagnose, Comments, ReturnLink) {
//     res.render('messageBoard', {
//         title: Title,
//         heading: Heading,
//         subtitle: Subtitle,
//         body: Body,
//         diagnose: Diagnose,
//         comments: Comments,
//         returnLink: ReturnLink
//     });
// }

module.exports = {
    newLogin(req, res, next) {
        if (!req.body.email || !req.body.password) {
            {
                title = 'USN | Sign In Error',
                heading = 'Sorry',
                subtitle = 'The account requirements are not satisfied.',
                body = 'Please provide all details.',
                diagnose = '',
                comments = '',
                returnLink = 'signin'
            }
            Error(res, title, heading, subtitle, body, diagnose, comments, returnLink)
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

                    {
                        title = 'USN | Error',
                        heading = 'Ouch!',
                        subtitle = 'Something went wrong on our side ?',
                        body = 'Our engineers are looking into it, if you see them tell them code give below.',
                        diagnose = '',
                        comments = '1011011 1000100 1000001 1010100 1000001 1000010 1000001 1010011 1000101 100000 1000101 1010010 1010010 1001111 1010010 1011101',
                        returnLink = 'logout'
                    }
                    Error(res, title, heading, subtitle, body, diagnose, comments, returnLink)
                }
                else if (results.length === 0) {
                    // No such user
                    {
                        title = 'USN | Sign In Error',
                        heading = 'Sorry',
                        subtitle = 'The account requirements are not satisfied.',
                        body = 'Email ID or Password is wrong.',
                        diagnose = '',
                        comments = '',
                        returnLink = 'signin'
                    }
                    Error(res, title, heading, subtitle, body, diagnose, comments, returnLink)
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

                        next()
                        // res.redirect('/dashboard');
                    }
                    else {
                        // Password is wrong

                        {
                            title = 'USN | Sign In Error',
                            heading = 'Sorry',
                            subtitle = 'The account requirements are not satisfied.',
                            body = 'Email ID or Password is wrong.',
                            diagnose = '',
                            comments = '',
                            returnLink = 'signin'
                        }
                        Error(res, title, heading, subtitle, body, diagnose, comments, returnLink)
                    }
                }
            });
        }
    }
}