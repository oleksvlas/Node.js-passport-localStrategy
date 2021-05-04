const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');

passport.serializeUser((user, done) => {
    console.log('Серіалізація ', user);
    return done(null, user)
});

passport.deserializeUser((username, done) => {
    console.log('Десеріалізація ', username);
    let userAct = db.filter(user => user.username === username)[0];
    return (userAct.username === username) ? done(null, userAct.username) : done(null, false);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function (username, password, done) {
    let userAct = db.filter(user => user.username === username)[0];
    if (typeof userAct === 'undefined') return done(null, false, {message: 'Невірне ім\'я користувача'});
    if (userAct.password !== password) return done(null, false, {message: 'Невірний пароль'});
    return done(null, userAct.username);
}));


module.exports = passport;
