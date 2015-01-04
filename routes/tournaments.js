var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('./../models/tournaments');
var TournamentModel = mongoose.model('TournamentModel');



module.exports = function() {

  // get all
  router.get('/', function(req, res, next) {
    TournamentModel.find(function(err, tournaments){
      if(err){ return next(err); }

      res.json(tournaments);
    });
  });


  // create
  router.post('/', function(req, res, next) {
    var Tournament = new TournamentModel(req.body);

    Tournament.save(function(err, tournament){
      if(err){ return next(err); }

      res.json(tournament);
    });
  });


  // get one
  router.get('/:id', function(req, res) {
    TournamentModel.findById(req.params.id)
    .populate({ path: 'players rounds.games.player1 rounds.games.player2 rounds.games.winner' })
    .exec(function(err, tournament){
      if(err){ return next(err); }

      res.json(tournament);
    })
    ;
  });


  // update one
  router.put('/:id', function(req, res) {
    TournamentModel.findById(req.params.id, function(err, tournament){
      if(err){ return next(err); }

      if (req.body.rounds.length && tournament.status === 'pending') {
        var rounds = req.body.rounds;

        // rounds
        for (var i = 0, roundsLength = rounds.length; i < roundsLength; i++) {

          // games
          var games = [];
          for (var j = 0, gamesLength = rounds[i].games.length; j < gamesLength; j++) {
            if (i > 0) {
              var gameItem = {
                _id: rounds[i].games[j].id,
                nextGame: rounds[i].games[j].nextGame
              };

              // if first round, set players id
              if (i === roundsLength-1) {
                gameItem.player1 = rounds[i].games[j].player1;
                gameItem.player2 = rounds[i].games[j].player2;
              }

            // final only
            } else {
              var gameItem = {_id: 0};
            }

            games.push(gameItem);
          };


          tournament.rounds.push({
            _id: rounds[i].round,
            games: games
          });
        };

        tournament.status = 'running';
        tournament.currentRound = rounds.length;
      }

      tournament.save(function(err) {
        if(err){
          console.log(err);
        } else {
          TournamentModel.populate(tournament, { path: 'players rounds.games.player1 rounds.games.player2 rounds.games.winner' },
            function(err, tournament) {
              if(err){ return next(err); }

              return res.json(tournament);
            }); 
        }
      });
      
    });
  });

  // add player
  router.post('/:id/:playerId', function(req, res) {
    TournamentModel.findById(req.params.id, function(err, tournament){
      if(err){ return next(err); }

      if (tournament.players.indexOf(req.params.playerId) !== -1) {
        return res.json({'message': 'User already subscribed.'});
      }

      tournament.players.push(req.params.playerId);

      tournament.playersCount ++;
      tournament.playersLeft ++;

      tournament.save(function(err) {
        if(err){
          console.log(err);
        } else {
          TournamentModel.populate(tournament, { path: 'players' },
            function(err, tournament) {
              if(err){ return next(err); }

              return res.json(tournament);
            }); 
        }
      });
      
    });
  });

  // remove player
  router.delete('/:id/:playerId', function(req, res) {
    TournamentModel.findById(req.params.id, function(err, tournament){
      if(err){ return next(err); }

      if (tournament.players.indexOf(req.params.playerId) === -1) {
        return res.json({'message': 'User not subscribed.'});
      }

      tournament.players.pull(req.params.playerId);

      tournament.playersCount --;
      tournament.playersLeft --;

      tournament.save(function(err) {
        if(err){
          console.log(err);
        } else {
          TournamentModel.populate(tournament, { path: 'players' },
            function(err, tournament) {
              if(err){ return next(err); }

              return res.json(tournament);
            }); 
        }
      });
      
    });
  });


  return router;
};