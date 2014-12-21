var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: 'Username is required' },
    email: { type: String, required: 'Email is required' },
    password: { type: String, required: 'Password is required' },
    createdAt: { type: Date, default: Date.now },
    points: { type: Number, default: 0 }
});

mongoose.model('UserModel', UserSchema);