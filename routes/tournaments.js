var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('./../models/tournaments');
var TournamentModel = mongoose.model('TournamentModel');



module.exports = function() {

  // get all
  router.get('/', function(req, res, next) {
    TournamentModel.find()
     .populate({ path: 'winner' })
     .exec(function(err, tournament){
       if(err){ console.log(err); }

       res.json(tournament);
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
    .populate({ path: 'players rounds.games.player1 rounds.games.player2 rounds.games.winnerId winner' })
    .exec(function(err, tournament){
      if(err){ console.log(err); }

      res.json(tournament);
    });
  });


  // update one
  router.put('/:id', function(req, res) {
    TournamentModel.findById(req.params.id, function(err, tournament){
      if(err){ return next(err); }

      // reset
      if (req.body.reset) {
        tournament.status = 'pending';
        tournament.players = [];
        tournament.rounds = [];
        tournament.playersCount = 0;
        tournament.playersLeft = 0;
        tournament.currentRound = 0;
        tournament.winner = undefined;
      }

      //set single game scores (from score popin)
      if (req.body.scores) {
        var scoresObj = req.body.scores;

        var round = tournament.rounds.id(scoresObj.roundId),
            game  = round.games.id(scoresObj.gameId);

        for (var key in scoresObj.scores) {
          game.scores.push(scoresObj.scores[key].player1 + ':' + scoresObj.scores[key].player2);
        }
        game.winnerId = scoresObj.winnerId;
        game.winner = scoresObj.winner;


        tournament.playersLeft = tournament.playersLeft-1;

        // check if round is finished
        var isRoundOver = true;
        for (var i = 0, len = round.games.length; i < len; i++) {
           if (!round.games[i].winner) {
            isRoundOver = false;
           }
        };

        if (isRoundOver) {
          tournament.isFinished = true;
          tournament.currentRound = tournament.currentRound-1;
        }

        // set next game's players
        if (game.nextGame) {
          var nextGame = tournament
                      .rounds.id(scoresObj.roundId-1)
                      .games.id(game.nextGame);

          // gameId is even => winnerId is next game player1
          if (scoresObj.gameId % 2 == 0) {
            nextGame.player1 = scoresObj.winnerId;
          } else {
            nextGame.player2 = scoresObj.winnerId;
          }

        // tournament is over
        } else {
          tournament.winner = scoresObj.winnerId;
          tournament.status = 'finished';
        }


      }

      // set start rounds (diagram)
      if (req.body.rounds && tournament.status === 'pending') {
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
              var gameItem = {_id: 1};
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
          TournamentModel.populate(tournament, { path: 'players rounds.games.player1 rounds.games.player2 rounds.games.winnerId winner' },
            function(err, tournament) {
              if(err){ console.log(err); }

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