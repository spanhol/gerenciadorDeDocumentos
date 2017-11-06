var bcrypt = require('bcryptjs');
var userCrud = require('../helpers/userCrud');

'use strict';

module.exports = class User {
  constructor(username, senha, name, email, role_id) {
    this.username = username;
    this.senha = senha;
    this.name = name;
    this.email = email;
    this.role_id = role_id;
  }
};

// module.exports.UserSchema = function(table) {
//   table.increments('id').primary();
//   table.string('username');
//   table.string('senha');
//   table.string('name');
//   table.string('email');
//   table.integer('role_id');
//   table.timestamps();
// };

module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.senha, salt, function (err, hash) {
      newUser.senha = hash;
      userCrud.saveUser(newUser, callback);
    });
  });
};

module.exports.getUserByUsername = function (username, callback) {
  userCrud.findOneByUsername(username, function (err, user) {
    callback(null, user);
  });
}

module.exports.getUserById = function (id, callback) {
  userCrud.findById(id, function (err, user) {
    callback(err, user);
  });
}

module.exports.compareSenha = function (candidateSenha, hash, callback) {
  bcrypt.compare(candidateSenha, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}
