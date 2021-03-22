var keywordsCrud = require('../helpers/keywordsCrud');


'use strict';

module.exports = class Keyword {
    constructor(word, created_at, updated_at) {
        this.word = word;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
};


module.exports.createKeyword = function (select, newKeyword, callback) {
    keywordsCrud.saveKeyword(newKeyword, function (err, id) {
        callback(err, id);
    });
};

module.exports.createKeywords = function (kwArray, callback) {
    keywordsCrud.filterIn(["id", "word"], kwArray, function (err, existing) {
        var existingIDs = [];
        for (j = 0; j < existing.length; j++) {
            existingIDs.push(existing[j].id);
        }
        var newKeyword = [];
        for (i = 0; i < kwArray.length; i++) {
            var igual = false;
            for (j = 0; j < existing.length; j++) {
                if (existing[j].word == kwArray[i]) {
                    igual = true;
                }
            }
            if (!igual) {
                newKeyword.push(Keyword(kwArray[i]));
            }
        }
        keywordsCrud.saveKeyword(newKeyword, function (err, id) {
            if (id && (!id.rows || id.rows.length != 0)) {
                existingIDs = existingIDs.concat(id);
            }
            callback(err, existingIDs);
        });
    });
};

module.exports.listar = function (campos, where, callback) {
    keywordsCrud.filter(campos, where, function (err, palavras) {
        callback(err, palavras);
    });
}

module.exports.sugestoes = function (palavra, callback) {
    if (palavra && palavra != "") {
        keywordsCrud.filterWhere("word", "word", "ilike", "%" + palavra + "%", 5, function (err, palavras) {
            callback(err, palavras);
        });
    } else {
        callback(null, []);
    }
}

module.exports.listarWordIn = function (select, whereIn, callback) {
    keywordsCrud.filterWordIn(select, whereIn, function (err, palavras) {
        callback(err, palavras);
    });
}

module.exports.listarIn = function (select, whereColum, arrayIn, callback) {
    keywordsCrud.filterIn(select, whereColum, arrayIn, function (err, palavras) {
        callback(err, palavras);
    });
}

module.exports.getKeywordById = function (id, callback) {
    keywordsCrud.findById(id, function (err, keyword) {
        callback(err, keyword);
    });
}



Keyword = function (word, created_at, updated_at) {
    var kw = {};
    kw.word = word;
    return kw;
}