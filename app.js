const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('./config/passportConfig');
const connectEnsureLogin = require('connect-ensure-login');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: 'Секретне слово',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('index', {
        user: req.user
    });
});

app.get('/books', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.render('books', {
        user: req.user
    });
});

app.get('/login', (req, res) => {
    req.logout();
    res.render('login');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: 'Некоректно введені дані',
    failureFlash: true
}));


app.listen(PORT, () => console.log(`Server starting on port - ${PORT}`));


