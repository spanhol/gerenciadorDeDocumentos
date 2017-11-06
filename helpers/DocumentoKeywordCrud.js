var documentoKeywordCrud = {};
var knex = require('../db/db');
var crud = require('./crud');

//@documentoKeyword aceita {} ou [{},{}]
documentoKeywordCrud.saveDocumentoKeyword = function (documentoKeyword, callback) {
    knex('documento_keyword').insert(documentoKeyword).then(function () {
        callback(null);
    });
};

documentoKeywordCrud.findByDocumentoId = function (id, callback) {
    crud.find('documento_keyword', { documento_id: id }, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento_keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

documentoKeywordCrud.findByKeywordId = function (id, callback) {
    crud.find('documento_keyword', { keyword_id: id }, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento_keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

documentoKeywordCrud.filter = function (select, where, callback) {
    crud.find('documento_keyword', select, where, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento_keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

module.exports = documentoKeywordCrud;