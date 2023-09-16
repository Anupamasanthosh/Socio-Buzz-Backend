const passport=require('passport')
var GoogleStrategy = require('passport-google-oauth20');
const User=require('../modals/userModal')
passport.use(new GoogleStrategy({
    clientID: '312510559884-s09liuu4slb0oakpe0sie17cuqt5nf9h.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    scope: [ 'profile' ],
    state: true,
    passReqToCallback:true
  },
  function verify(accessToken, refreshToken, profile, cb) {
    deleteOne(null,profile)
  }
));