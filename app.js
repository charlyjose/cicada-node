var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var expressSession = require('express-session');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(expressSession({ secret: 'I have a duck, who\'s name is duckey', saveUninitialized: false, resave: false }));


// Router Specifications
var appJS = require('./routes/appJS');
var appCSS = require('./routes/appCSS');
var favic = require('./routes/favic');
var usnLogo = require('./routes/usnLogo');

var signupRouter = require('./routes/signup');
var signinRouter = require('./routes/signin');
var homeRouter = require('./routes/home');

var logoutRouter = require('./routes/logout');

var forgotPasswordRouter = require('./routes/forgotPassword');
var resetPasswordRouter = require('./routes/resetPassword');
var profileRouter = require('./routes/profile');
var youRouter = require('./routes/you');
var feedsRouter = require('./routes/feeds');
var writePostRouter = require('./routes/writePost');
var resetUserRouter = require('./routes/resetUser');
var resetContactsRouter = require('./routes/resetContacts');
var deleteAccRouter = require('./routes/deleteAccount');

var checkUsernameRouter = require('./routes/check-username');
var checkEmailRouter = require('./routes/check-email');
var checkCollegeIDRouter = require('./routes/check-collegeID');
var checkPasswordOld = require('./routes/check-passwordold');

var otpAuth = require('./routes/otpAuth');

var errorHandle = require('./routes/error');

// CORS Header Setting
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Routers

// Home Page
app.use('/', homeRouter);
app.use('/home', homeRouter);

// User Profile
app.use('/profile', profileRouter);

// Write Post
app.use('/writepost', writePostRouter);

// Complete basic profile
app.use('/you', youRouter);

// User feeds
app.use('/feeds', feedsRouter);

// Signup
app.use('/signup', signupRouter);

// Signin
app.use('/login', signinRouter);
app.use('/signin', signinRouter);

// Logout
app.use('/logout', logoutRouter);

app.use('/forgotpassword', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);
app.use('/reset-username', resetUserRouter);
app.use('/reset-contacts', resetContactsRouter);
app.use('/delete-account', deleteAccRouter);

// Check Username
app.use('/check-username', checkUsernameRouter);
// Check Email ID
app.use('/check-email', checkEmailRouter);
// Check CollegeID ID
app.use('/check-collegeID', checkCollegeIDRouter);
// Check Old Password
app.use('/check-passwordold', checkPasswordOld);

// OTP auth
app.use('/verify', otpAuth);

// Error
app.use('/error', errorHandle);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};



  
  // render the error page
  res.status(err.status || 404);
  // res.render('messageBoard', {
  //   title: 'USN | Error 404',
  //   heading: '404',
  //   subtitle: 'Page not found',
  //   body: 'The page you are looking for might have been removed.',
  //   diagnose: '',
  //   comments: '',
  //   returnLink: 'home'
  // });

  res.redirect('/error');
});


module.exports = app;