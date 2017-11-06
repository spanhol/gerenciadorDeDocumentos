var crud = {};
var knex = require('../db/db');

crud.findById = function (table, id, callback) {
  knex(table).select().where('id', id)
    .then(function (result) {
      if (result[0]) {
        callback(null, result[0]);
        return result[0];
      } else {
        callback({
          message: 'Não encontrado.'
        }, null);
      }
    });
}

crud.find = function (table, select, where, callback) {
  knex(table)
    .select(select)
    .where(where)
    .then(function (result) {
      if (result) {
        callback(null, result);
        return result;
      } else {
        callback({
          message: 'Não encontrado.'
        }, null);
      }
    });
}

//whereIn('id', [1, 2, 3])
crud.findIn = function (table, select, whereField, whereIn, callback) {
  knex(table)
    .select(select)
    .whereIn(whereField, whereIn)
    .then(function (result) {
      if (result) {
        callback(null, result);
        return result;
      } else {
        callback({
          message: 'Não encontrado.'
        }, null);
      }
    });
}

//Where('colula', 'operador' , 'valor')
//Where('colula', '>' , 100)
//Where('colula', 'like' , '%nome%')
crud.findWhere = function (table, select, coluna, operador, valor, limit, callback) {
  knex(table)
    .select(select)
    .where(coluna, operador, valor)
    .limit(limit)
    .then(function (result) {
      if (result) {
        callback(null, result);
        return result;
      } else {
        callback({
          message: 'Não encontrado.'
        }, null);
      }
    });
}

module.exports = crud;
