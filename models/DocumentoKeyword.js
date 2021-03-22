var documentoKeywordCrud = require('../helpers/documentoKeywordCrud');

'use strict';

module.exports = class DocumentoKeywordCrud {
    constructor(documento_id, keyword_id) {
        this.documento_id = documento_id;
        this.keyword_id = keyword_id;
    }
};

//@documentoKeyword aceita {} ou [{},{}]
module.exports.createDocumentoKeyword = function (newDocumentoKeyword, callback) {
    documentoKeywordCrud.saveDocumentoKeyword(newDocumentoKeyword, function (err) {
        callback(err);
    });
};

module.exports.getKeywordByDocumentoId = function (documento_id, callback) {  
    documentoKeywordCrud.findByDocumentoId(documento_id, function (err, keywords) {
        callback(err, keywords);
    });
}

module.exports.listar = function (campos, where, callback) {
    documentoKeywordCrud.filter(campos, where, function (err, result) {
        callback(err, result);
    });
}

