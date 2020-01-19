var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documento = require('../models/documentos');


// Get lista de documentos
router.get('/', ensureAuthenticated, function (req, res) {
	console.log("get /keyword");
	var lista = [];
	Documento.listar([], {}, function (err, result) {
		var docs = result.rows;
		lista = [];
		for (var i = 0; i < docs.length; i++) {
			item = {}
			item.id = docs[i].id;
			item.nome = docs[i].nome;
			item.data = docs[i].updated_at;
			item.tipo = docs[i].tipo;
			item.keywords = docs[i].keywords;
			lista[i] = item;
		}
		res.render('documentos', { documentos: lista, arquivo: true });
	});
});

// Get single keyword
router.get('/:k', ensureAuthenticated, function (req, res) {
	console.log("get /keyword/" + req.params.k);
	var key = [];
	key.push(req.params.k);
	var lista = [];
	Documento.filterByKeywords(key, 1000, 0, function (err, result) {
		
		var docs = result.rows;
		lista = [];
		temKeyword = false;
		// console.log("Callback " + key[0]  + " DOC len " + docs.length);
		for (var i = 0; i < docs.length; i++) {
			item = {}
			item.id = docs[i].id;
			item.nome = docs[i].nome;
			item.data = docs[i].updated_at;
			item.tipo = docs[i].tipo;
			item.keywords = docs[i].keywords;
			// console.log("KEY " + key[0]);
			for (var j = 0; j < item.keywords.length; j++) {
				if (item.keywords[j] == key[0]){
					temKeyword = true;
					break;
				}
			}
			if (temKeyword){
				lista.push(item);
				//console.log("item " + item);
			}
		}
		
		res.render('documentos', { documentos: lista, arquivo: true });
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;