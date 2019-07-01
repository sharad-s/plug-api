const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const { User } = require('../models/user');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_PRIVATE_KEY;
 
module.exports = passport => {
  console.log('Using Passport');
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log(jwt_payload);
      User.findById(jwt_payload._id)
        .then(user => {
          if (user) {
            // console.log('USER FOUND!: ', user);
            return done(null, user);
          } else {
            // console.log('USER NOT FOUND: ', user);
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};