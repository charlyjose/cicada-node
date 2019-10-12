var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xxxx@xxxx.xxx',
        pass: 'xxxxxxxxxxxxx'
    }
});

module.exports = transporter;