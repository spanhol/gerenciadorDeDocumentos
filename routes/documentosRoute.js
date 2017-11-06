var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documento = require('../models/documentos');
var Keywords = require('../models/keywords');

// Get lista de documentos
router.get('/', ensureAuthenticated, function (req, res) {
	console.log("get /documentos");
	res.render('documentos', { documentos: [], arquivo: true });
});

router.post('/filtro', function (req, res) {
	// console.log("\najax /filtro kw=" + req.body.keyword + " , pagina=" + req.body.pagina);
	kw = req.body.keyword.split(";");
	pagina = req.body.pagina;
	documentosPorPagina = req.body.documentosPorPagina;
	Documento.filterByKeywords(kw, null, null, function (err, result) {
		//TODO trata erro / vazio
		req.body.result = result;
		var last = kw[kw.length - 1];
		Keywords.sugestoes(last, function (err, sug) {
			req.body.sugestoes = sug;
			res.send(req.body);
		});
	});
});

router.post('/sugestoes', function (req, res) {
	kw = req.body.keyword.split(";");
	Keywords.sugestoes(kw[kw.length - 1], function (err, sug) {
		req.body.sugestoes = sug;
		res.send(req.body);
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