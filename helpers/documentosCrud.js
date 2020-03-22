var documentosCrud = {};
var knex = require('../db/db');
var crud = require('./crud');


documentosCrud.saveDocumento = function (documento, callback) {
    // documento.created_at = knex.CURRENT_TIMESTAMP;
    documento.created_at = new Date().toISOString();
    documento.updated_at = new Date().toISOString();
    knex('documentos').insert(documento).returning('id').then(function (id) {
        if (id && id[0]) {
            // console.log("salvo documento: ")
            // console.log(documento);
            callback(null, id[0]);
        } else {
            callback('ERRO ao inserir dados no banco de dados', null);
        }
    });
};


documentosCrud.findById = function (id, callback) {
    crud.findById('documentos', id, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'Documento não encontrado.' };
        }
        callback(novoErro, result);
    });
}

documentosCrud.filter = function (select, where, callback) {
    crud.find('documentos', select, where, function (err, result) {
        var novoErro = err;
        if (err) {
            novoErro = { message: 'documento não encontrado.' };
        }
        callback(novoErro, result);
    });
};

documentosCrud.filterJoinKeywords = function (limit, offset, callback) {
    var sql = "select id, nome, tipo, created_at, updated_at, "
        + " (select json_agg(word) "
        + " from documentos as d "
        + " inner join documento_keyword on documento_id = d.id "
        + " inner join keyword on keyword_id = keyword.id "
        + " where documento_id = doc.id ) as keywords "
        + " from documentos as doc ";
    if (limit) {
        sql += " limit " + limit;
    }
    if (offset) {
        sql += " offset " + offset;
    }
    knex.schema.raw(sql)
        .then(function (result) {
            var novoErro = null;
            if (!result || result.row) {
                novoErro = { message: 'Erro filterJoinKeywords.' };
            }
            callback(novoErro, result);
        });
};

//keywords = [];
documentosCrud.filterByKeywords = function (keywords, limit, offset, callback) {
    knex("documentos")
        .innerJoin('documento_keyword', 'documento_id', 'd.id')
        .innerJoin('keyword', 'keyword_id', 'keyword.id')
        .whereRaw()

    var sql = "select id, nome, tipo, created_at, updated_at, "
        + " (select json_agg(word) "
        + " from documentos as d "
        + " inner join documento_keyword on documento_id = d.id "
        + " inner join keyword on keyword_id = keyword.id "
        + " where documento_id = doc.id)  as keywords "
        + " from documentos as doc ";
    if (keywords && keywords.length > 0) {
        sql += "where ";
        for (var i = 0; i < keywords.length; i++) {
            var ekw = keywords[i];
            ekw = ekw.replace(/'/g, "");
            ekw = ekw.replace(/"/g, "");
            ekw = ekw.replace(/\\/g, "\\\\");
            if (i > 0) {
                sql += "and ";
            }
            sql += "id in ("
                + "select d.id from documentos as d inner join documento_keyword on documento_id = d.id "
                + "inner join keyword on keyword_id = keyword.id ";
            sql += "where word ilike (";
            sql += "'" + keywords[i] + "' ";
            sql += "))";
        }
    }

    if (limit) {
        sql += " limit " + limit;
    }
    if (offset) {
        sql += " offset " + offset;
    }
    // console.log(sql);
    //TODO deve ser um AND nas palavras
    knex.schema.raw(sql)
        .then(function (result) {
            var novoErro = null;
            if (!result || result.row) {
                novoErro = { message: 'Erro filterJoinKeywords.' };
            }
            callback(novoErro, result);
        });
};

module.exports = documentosCrud;