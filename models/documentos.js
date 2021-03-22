var documentosCrud = require('../helpers/documentosCrud');
var Keywords = require('../models/keywords');
var DocumentoKeyword = require('./documentoKeyword');

'use strict';

module.exports = class Documentos {
    constructor(nome, tipo, created_at, updated_at) {
        this.nome = nome;
        this.tipo = tipo;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
};


module.exports.createDocumento = function (newDocumento, callback) {
    documentosCrud.saveDocumento(newDocumento, function (err, id) {
        callback(err, id);
    });
};

module.exports.getDocumentoById = function (id, callback) {
    documentosCrud.findById(id, function (err, documento) {
        callback(err, documento);
    });
}

module.exports.listarDocumentos = function (limit, offset, callback) {
    documentosCrud.filterJoinKeywords(limit, offset, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento_keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

module.exports.filterByKeywords = function (keywords, limit, offset, callback) {
    var kw = [];
    keywords.forEach(function (e) {
        if (e && e != "") {
            kw.push(e);
        }
    }, this);
    documentosCrud.filterByKeywords(kw, limit, offset, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento_keyword não encontrado.' };
        }
        callback(novoErro, result);
    });
}

module.exports.getFileName = function (documento) {
    return documento.id + "_" + documento.nome;
}
