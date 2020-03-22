var cfg = require('../config');

var config      = require('./knexfile.js');
// var env         = 'development';
var env         = cfg.env;
var knex        = require('knex')(config[env]);

module.exports = knex;

// knex.migrate.latest([config]);
