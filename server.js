// requires dependencies
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var methodOverride = require('method-override');
var localStrategy = require('passport-local').Strategy;
var isAuthenticated = require('./middleware/isAuthenticated');

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

// console logs if authenticated or not
app.use(function (req, res, next) {
  console.log(req.isAuthenticated());
  next();
});

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

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// to view a list of gallery photos
app.get('/', function (req, res) {
  db.Gallery.findAll({})
    .then(function (results) {
      res.render('index', {Galleries:results});
  });
});

// to see a "new photo" form
// now requires authentication from passport
app.get('/gallery/new',
  isAuthenticated,
  function (req, res) {
    res.render('newPhoto', {});
});

// // to see a single gallery photo
app.get('/gallery/:id', function (req, res) {
  db.Gallery.find({
    where: {
      id: req.params.id
    }
  })
  .then(function (results) {
    res.render('single', {Galleries:results});
  });
});

// to create a new gallery photo
app.post('/gallery/', function (req, res) {
  Gallery.create(req.body)
    .then(function (result) {
      res.redirect('/gallery/'+result.id);
    });
});

// // to see a form to edit a gallery photo identified by the :id
app.get('/gallery/:id/edit',
  isAuthenticated,
  function (req, res) {
    db.Gallery.find({
      where: {
        id: req.params.id
      }
    })
    .then(function (results) {
      res.render('edit', {Galleries:results});
    });
});

// // updates a single gallery photo identified by the :id
// app.put('/gallery/:id', function (req, res) {

// });

// // to delete a single gallery photo identified by the :id
// app.delete('/gallery/:id', function (req, res) {

// });

// logout request! Currently don't work T__T
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

db.sequelize
  .sync()
  .then(function () {
    app.listen(CONFIG.PORT, function() {
      console.log('Server listening on port', CONFIG.PORT);
    });
  });

