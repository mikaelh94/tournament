var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


module.exports = function() {
  
  /* GET home page. */
  router.get('/', function(req, res){
    res.render('index');
  });

  return router;
};