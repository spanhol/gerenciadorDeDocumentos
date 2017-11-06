var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var config = require('./config');

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db/db');

var fs = require('fs');

var routes = require('./routes/indexRoute');
var documentos = require('./routes/documentosRoute');
var doc = require('./routes/docRoute');
var users = require('./routes/usersRoute');

var documentoshelper = require('./helpers/documentosHelper');




// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('renderDocumentos', function (items, options) {
  return documentoshelper.renderDocumentos(items, options);
});

// Express Session
app.use(session({
  secret: 'Mov.3547p99',    //Move para fora do codigo
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/documentos', documentos);
app.use('/documento', doc);

// Set Port
if (config.env == 'development') {
  app.set('port', (process.env.PORT || config.development.port));
}
if (config.env == 'production') {
  app.set('port', (process.env.PORT || config.production.port));
}

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});
