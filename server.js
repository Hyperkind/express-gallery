// requires dependencies
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var methodOverride = require('method-override');
var localStrategy = require('passport-local').Strategy;
// var isAuthenticated = require('./middleware/isAuthenticated');
var router = express.Router();

// requires other files
var CONFIG = require('./config');
var db = require('./models');

var app = express();

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(session(CONFIG.SESSION));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
// middleware to direct all routes beginning with /gallery to the required file
app.use('/gallery', require('./routers/galleryRouter'));

// console logs if authenticated or not
// app.use(function (req, res, next) {
//   console.log(req.isAuthenticated());
//   next();
// });

// links loin page to users database and checks for correct login
passport.use(new localStrategy (
  function (username, password, done) {
    db.User.find({
      where:{
        username: username
      }
    })
    .then(function (user) {
      if (user.password !== password) {
        return done(null, false1);
      }
      return done(null, user);
    })
    .catch(function (err) {
      return done(null, false);
    });
  })
);

passport.serializeUser(function (user, done) {
  return done(null, {});
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

// get and post request for /login
app.get('/login', function (req, res) {
  res.render('login');
});

// upon successful login, redirects to /, if failure stays on login page
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

// to view a list of gallery photos
app.get('/', function (req, res) {
  db.Gallery.findAll({})
    .then(function (results) {
      res.render('index', {Galleries:results});
  });
});

// logout request! Currently don't work T__T
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// Catch-all route undefined handler
app.use(function (err, req, res, next) {
  res.status(404);
  return res.send('What are you doing here?');
});

// Default catch all middleware error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(500);
    return res.send('Something bad happened...');
  }
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(CONFIG.PORT, function() {
      console.log('Server listening on port', CONFIG.PORT);
    });
  });

