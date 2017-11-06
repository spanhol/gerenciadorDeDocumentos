var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documento = require('../models/documentos');
var Keywords = require('../models/keywords');

// Get single document
router.get('/:id', ensureAuthenticated, function (req, res) {
	console.log("get /documentos/:" + req.body.id);
	res.render('documento');
});

// Download a document
router.get('/:id/download', ensureAuthenticated, function (req, res) {
	console.log("get /documento/:" + req.params.id + "/download");
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