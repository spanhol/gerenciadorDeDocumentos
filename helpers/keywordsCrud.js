var keywordsCrud = {};
var knex = require('../db/db');
var crud = require('./crud');

keywordsCrud.saveKeyword = function (keyword, callback) {
    // keyword.created_at = knex.CURRENT_TIMESTAMP;
    keyword.created_at = Date.now();
    knex('keyword').insert(keyword).returning('id').then(function (id) {
        if (id) {
            console.log("keyword criada:");
            console.log(keyword);
            callback(null, id);
        } else {
            callback('ERRO ao inserir dados no banco de dados (keywordsCrud.saveKeyword)', null);
        }
    });
};

keywordsCrud.findById = function (id, callback) {
    crud.findById('keyword', id, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'Keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

//Where('colula', 'operador' , 'valor')
//Where('colula', '>' , 100)
//Where('colula', 'like' , '%nome%')
keywordsCrud.filterWhere = function (select, coluna, operador, valor, limit, callback) {
    crud.findWhere('keyword', select, coluna, operador, valor, limit, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

keywordsCrud.filterIn = function (select, whereColum, arrayIn, callback) {
    crud.findIn('keyword', select, whereColum, arrayIn, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

keywordsCrud.filterWordIn = function (select, whereIn, callback) {
    crud.findIn('keyword', select, "word", whereIn, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

module.exports = keywordsCrud;