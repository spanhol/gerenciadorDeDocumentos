var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
  res.render('register');
});

// Login
router.get('/login', function (req, res) {
  res.render('login', {layout: "layoutlogin"});
});

// Register User
//usuario rh rhdocumentos
router.post('/register', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var senha = req.body.senha;
  var senha2 = req.body.senha2;

  // Validation
  req.checkBody('name', 'Nome é obrigatório').notEmpty();
  req.checkBody('email', 'E-mail é obrigatório').notEmpty();
  req.checkBody('email', 'O E-mail informado não é valido').isEmail();
  req.checkBody('username', 'Login é obrigatório').notEmpty();
  req.checkBody('senha', 'Senha é obrigatória').notEmpty();
  req.checkBody('senha2', 'Senhas não coincidem').equals(req.body.senha);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User(username, senha, name, email, 0);

    User.createUser(newUser, function (err, user) {
      if (err) throw err;
    });

    req.flash('success_msg', 'Você está registrado e pode entrar na sua conta.');

    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy(function (username, senha, done) {
  User.getUserByUsername(username, function (err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, {
        message: 'Login incorreto, tente novamente.'
      });
    }
    User.compareSenha(senha, user.senha, function (err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Senha incorreta, tente novamente.'
        });
      }
    });
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    badRequestMessage: 'Por favor informe login e senha.',
    failureFlash: true
  }),
  function (req, res) {
    res.redirect('/');
  });

router.get('/logout', function (req, res) {
  req.logout();

  // req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});

module.exports = router;
