var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documento = require('../models/documentos');


// Get lista de documentos
router.get('/', ensureAuthenticated, function (req, res) {
	console.log("get /documentos");
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

// Get single document
router.get('/:id', ensureAuthenticated, function (req, res) {
	console.log("get /documentos/:" + req.body.id);
	res.render('documento');
});

// Download a document
router.get('/:id/download', ensureAuthenticated, function (req, res) {
	console.log("get /documentos/:" + req.params.id + "/download");
	var uploadDir = config.getUploadDir(__dirname);
	Documento.getDocumentoById(req.params.id, function (err, documento) {
		if (documento) {
			console.log(documento);
			if (uploadDir) {
				var file = uploadDir + '/' + Documento.getFileName(documento);
				console.log("uploadDir " + file);
				res.download(file, documento.nome);
			} else {
				console.log("uploadDir FAILS");
			}
		}
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