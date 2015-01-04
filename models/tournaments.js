var mongoose = require('mongoose');



var GameSchema = new mongoose.Schema({
    _id: { type: Number, default: 0 },
    player1: { type: mongoose.Schema.ObjectId, ref: 'UserModel'},
    player2: { type: mongoose.Schema.ObjectId, ref: 'UserModel'},
    scores: [String],
    winner: { type: mongoose.Schema.ObjectId, ref: 'UserModel'},
    nextGame: Number
});

var RoundSchema = new mongoose.Schema({
    _id: { type: Number, default: 0 },
    games: [GameSchema],
    isFinished: { type: Boolean, default: false }
});

var TournamentSchema = new mongoose.Schema({
    name: { type: String, required: 'Tournament name is required' },
    createdAt: { type: Date, default: Date.now },
    matchToWin: { type: Number, min: 1, max: 12, default: 1 },
    playersMax: { type: Number, default: 64 },
    playersCount: { type: Number, default: 0 },
    playersLeft: { type: Number, default: 0 },
    status: { type: String, default: 'pending' },
    currentRound: { type: Number, default: 0 },
    players: [
      { type: mongoose.Schema.ObjectId, ref: 'UserModel'}
    ],
    rounds: [RoundSchema]
});

mongoose.model('TournamentModel', TournamentSchema);