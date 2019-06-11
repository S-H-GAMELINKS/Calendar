require('dotenv').config();

const express = require("express");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function extractProfile(profile) {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl,
    };
}

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    accessType: 'offline',
}, function (accessToken, refreshToken, profile, done) {
    if (profile) {
        return done(null, profile);
    }
    else {
        return done(null, false);
    }
}));

const router = express.Router();

router.get('/login',
    passport.authenticate('google', { scope: ['email', 'profile'], session: false, }),
);

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect("/");
});

module.exports = router;