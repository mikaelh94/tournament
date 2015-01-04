var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



module.exports = function(passport) {


  router.post('/register', function(req, res) {
    passport.authenticate('register', function(err, user, info) {
      return res.json({user: user, info: info});
    })(req, res);
  });


  router.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user, info) {
      return res.json({user: user, info: info});
    })(req, res);
  });


  router.get('/logout', function(req, res) {
    req.logout();
    res.json(req.user);
  });


  router.get('/user', function(req, res) {
    res.json(req.user);
  });


  return router;
};