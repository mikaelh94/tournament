var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('./../models/tournaments');
var TournamentModel = mongoose.model('TournamentModel');

require('./../models/users');
var UserModel = mongoose.model('UserModel');



module.exports = function(passport) {
  /* GET home page. */
  router.get('/', function(req, res){
    res.render('index');
  });


  /**
   *  Tournaments routes
   */

  router.get('/tournaments', function(req, res, next) {
    TournamentModel.find(function(err, tournaments){
      if(err){ return next(err); }

      res.json(tournaments);
    });
  });

  router.post('/tournaments', function(req, res, next) {
    var Tournament = new TournamentModel(req.body);

    Tournament.save(function(err, tournament){
      if(err){ return next(err); }

      res.json(tournament);
    });
  });


  /**
   *  Users routes
   */

  router.post('/auth/register', passport.authenticate('register'), function(req, res) {
    res.json(req.user);
  });

  router.post('/auth/login', passport.authenticate('login'), function(req, res) {
    res.json(req.user);
  });

  router.get('/auth/logout', function(req, res) {
    req.logout();
    res.json(req.user);
  });

  router.get('/auth/user', function(req, res) {
    res.json(req.user);
  });

  return router;
};