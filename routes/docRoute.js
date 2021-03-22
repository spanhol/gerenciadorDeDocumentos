var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documentos = require('../models/documentos');
var DocumentoKeyword = require('../models/documentoKeyword');
var Keywords = require('../models/keywords');

// Get single document
router.get('/:id', ensureAuthenticated, function (req, res) {
	console.log("get /documento/:" + req.params.id);
	Documentos.getDocumentoById(req.params.id, function (err, documento) {
		if (documento) {
			console.log("get documento");
			console.log(documento);
			DocumentoKeyword.getKeywordByDocumentoId(req.params.id, function (err, keywordsResult) {
				if (keywordsResult) {
					kw = [];
					keywordsResult.forEach(e => {
						kw.push(e.keyword_id);
					});
					Keywords.listarIn("word", "id", kw, function (err, keywords) {
						if (keywords) {
							kwstring = "";
							keywords.forEach(e => {
								if (kwstring == "") {
									kwstring = e.word;
								} else {
									kwstring = kwstring + "; " + e.word;
								}
							});
							console.log(kwstring);
							res.render('documento', { "documento": documento, "keywords": kwstring, "editar": true });
						}
					});
				} else {
					console.log("get keywords FAILS");
					res.render('documento', { "documento": Documentos, "keywords": "", "editar": true });
				}
			});
		} else {
			console.log("get documento FAILS");
		}
	});
});

// Download a document
router.get('/:id/download', ensureAuthenticated, function (req, res) {
	console.log("get /documento/:" + req.params.id + "/download");
	var uploadDir = config.getUploadDir(__dirname);
	Documentos.getDocumentoById(req.params.id, function (err, documento) {
		if (documento) {
			// console.log(documento);
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

//update a single document
router.post('/:id', ensureAuthenticated, function (req, res) {
	console.log("post /documento/:" + req.params.id);
	console.log(req.body);
	res.redirect('/documento/' + req.params.id);

});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;