var mongoose = require('mongoose');

var TournamentSchema = new mongoose.Schema({
    name: { type: String, required: 'Tournament name is required' },
    createdAt: { type: Date, default: Date.now },
    matchToWin: { type: Number, min: 1, max: 64, default: 1 },
    playersMax: { type: Number, default: 64 },
    playersCount: { type: Number, default: 0 },
    playersLeft: { type: Number, default: 0 },
    status: { type: String, default: 'waiting' },
    currentRound: { type: Number, default: 0 },
    players: { type: String, default: '' }
});

mongoose.model('TournamentModel', TournamentSchema);