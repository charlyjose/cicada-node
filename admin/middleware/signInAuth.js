const db = require('../connectDB');

module.exports = {
    signInAuth(req, res, next) {
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
                    // req.session.error = 'Invalid'
                    return res.redirect('/signin');
                }
                else {
                    res.locals.Name = results[0].name
                    res.locals.collegeID = results[0].collegeID
                    // Verified
                    next()
                }
            });
        }
        else {
            // Not signed in
            // req.session.error = 'Invalid'
            return res.redirect('/signin');
        }
    }
}