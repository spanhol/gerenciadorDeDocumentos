var userCrud = {};
var knex = require('../db/db');
var crud = require('./crud');

userCrud.saveUser = function (user, callback) {
  knex('user').insert(user).returning('id').then(function (id) {
    if (id) {
      console.log("Usuario criado: ")
      console.log(user);
      callback(null, id);
    } else {
      callback('ERRO ao inserir dados no banco de dados', null);
    }
  });
};

userCrud.findOneByUsername = function (username, callback) {
  knex('user').select().where('username', username)
    .then(function (result) {
      if (result  && result[0]) {
        callback(null, result[0]);
        return result[0];
      } else {
        callback({
          message: 'Usuário não encontrado'
        }, null);
      }
    });
}

userCrud.findById = function (id, callback) {
  crud.findById('user', id, function (err, result) {
    var novoErro = err;
    if (err) {
      novoErro = { message: 'Usuário não encontrado.' };
    }
    callback(novoErro, result);
  });
}

module.exports = userCrud;
