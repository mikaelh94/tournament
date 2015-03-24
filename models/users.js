var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: 'Username is required' },
    email: { type: String, required: 'Email is required' },
    password: { type: String, required: 'Password is required', select: false },
    createdAt: { type: Date, default: Date.now, select: false },
    points: { type: Number, default: 500 }
});

mongoose.model('UserModel', UserSchema);