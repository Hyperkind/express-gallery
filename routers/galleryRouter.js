var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middleware/isAuthenticated');
// var methodOverride = require('method-override');

var db = require('../models');
var Gallery = db.Gallery;

// app.use(methodOverride('_method'));

// route when adding a new photo to the database. Working!
router.route('/')
  .post(function (req, res) {
    Gallery.create(req.body)
      .then(function (result) {
        res.redirect('/gallery/'+result.id);
      });
  });

// routes to /gallery/new
router.route('/new')
  .get(
    isAuthenticated,
    function (req, res) {
      res.render('newPhoto', {});
    }
  );

// routes to /gallery/:id
router.route('/:id')
  .get(function (req, res) {
    console.log(req.params);
    Gallery.find({
      where: {
        id: req.params.id
      }
    })
    .then(function (results) {
      res.render('single', {Galleries:results});
    });
  })
  // put request for :id/edit, currently making a new entry
  .put(
    isAuthenticated,
    function (req, res) {
      var editPhoto = {
        author: req.body.author,
        link: req.body.link,
        description: req.body.description
      };

      var query = {
        where: { id: req.params.id},
        returning: true
      };

      Gallery.update (editPhoto, query)
        .then(function (gallery) {
          res.render('single', { Galleries:results });
        });
      // Gallery.find({
      //   where: {
      //     id: parseInt(req.params.id)
      //   }
      // })
      // .then(function (results) {
      //   res.render('single', { Galleries:results });
      // });
    })
  // works
  .delete(
    isAuthenticated,
    function (req, res) {
      console.log(req.params);
      Gallery.destroy({
        where: {
          id: parseInt(req.params.id)
        }
      })
      .then(function (results) {
        res.redirect('/');
      });
    }
  );

// routes to /gallery/:id/edit
router.route('/:id/edit')
  .get(
    isAuthenticated,
    function (req, res) {
      Gallery.find({
        where: {
          id: req.params.id
        }
      })
      .then(function (results) {
        res.render('edit', { Galleries:results });
      });
    }
  );






module.exports = router;