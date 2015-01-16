var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('./../models/users');
var UserModel = mongoose.model('UserModel');



module.exports = function() {


  router.get('/', function(req, res, next) {
    UserModel.find(function(err, users){
      if(err){ return next(err); }

      res.json(users);
    });
  });


  router.get('/:id', function(req, res) {
    UserModel.findById(req.params.id, function(err, user){
      if(err){ return next(err); }

      res.json(user);
    });
  });

  router.put('/:id', function(req, res) {
    UserModel.findById(req.params.id, function(err, user){
      if(err){ return next(err); }

      if (req.body.points) {
        user.points = req.body.points;
      }

      user.save(function(err, user){
        if(err){ return next(err); }

        res.json(user);
      });
    });
  });


  return router;
};