var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('messageBoard', {
        title: 'USN | Error 404',
        heading: '404',
        subtitle: 'Page not found',
        body: 'The page you are looking for might have been removed.',
        diagnose: '',
        comments: '',
        returnLink: 'home'
      });
});

module.exports = router;