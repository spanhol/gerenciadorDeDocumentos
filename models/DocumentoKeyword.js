var documentoKeywordCrud = require('../helpers/DocumentoKeywordCrud');

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

module.exports.getDocumentoKeywordById = function (documento_id, keyword_id, callback) {
    documentoKeywordCrud.findById(documento_id, keyword_id, function (err, doc_key) {
        callback(err, doc_key);
    });
}

module.exports.listar = function (campos, where, callback) {
    documentoKeywordCrud.filter(campos, where, function (err, result) {
        callback(err, result);
    });
}

