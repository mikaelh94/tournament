var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

require('./../models/users');
var UserModel = mongoose.model('UserModel');


module.exports = function(passport){

    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {

            // find by username or email
            var findBy = (username.indexOf('@') === -1) ? {'username': username} : {'email': username};

            // check in mongo if a user with username exists or not
            UserModel.findOne( findBy, '+password',
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, 'User Not found.');                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, 'Invalid Password'); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    req.login(user, function (err) {
                        if (err) {
                            throw err;
                        }
                    });    
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}