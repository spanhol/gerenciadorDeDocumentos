var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var config = require('../config');
var Documento = require('../models/documentos');
var Keywords = require('../models/keywords');
var DocumentoKeyword = require('../models/DocumentoKeyword');

// Get Homepage
router.get('/', ensureAuthenticated, function (req, res) {
	console.log("get /");
	res.render('index', { upload: true });
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}


//UPLOADS
router.use(express.static(path.join(__dirname, '/../public')));

router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

router.post('/upload', function (req, res) {
	// create an incoming form object
	var form = new formidable.IncomingForm();
	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory

	form.uploadDir = config.getUploadDir(__dirname);
	var uploads = { fileid: [], keyword: [] };

	form.on('file', function (field, file) {
		//salva metadata no banco
		var doc = new Documento(
			file.name,
			file.type,
			file.lastModifiedDate,
			file.lastModifiedDate);
		Documento.createDocumento(doc, function (err, id) {
			if (err) {
				console.log("err 1");
				console.log(err);
				//trata erro
			} else {
				Documento.getDocumentoById(id, function (err, doc) {
					if (err || !doc) {
						console.log("err 2");
						console.log(doc);
						//trata erro
					} else {
						var filename = doc.id + "_" + file.name;
						// every time a file has been uploaded successfully rename it
						fs.rename(file.path, path.join(form.uploadDir, filename));
						// console.log("salvo arquivo: " + filename);
						uploads.fileid.push(doc.id);
						processoSalvaDocumentoKeyword(uploads);
					}
				});
			}
		});
	});

	form.on('field', function (field, keywords) {
		var kwArray = keywords.split(";");
		for (var i = 0; i < kwArray.length; i++) {
			kwArray[i] = kwArray[i].trim();
			if (kwArray[i] == "") {
				kwArray = kwArray.splice(i, 1);
				i--;
			}
		}
		Keywords.createKeywords(kwArray, function (err, res) {
			if (err) {
				console.log("err kwArray insert");
				console.log(err);
				//trata erro
			} else {
				uploads.keyword.push.apply(uploads.keyword, res);
				processoSalvaDocumentoKeyword(uploads);
			}
		});
	});

	// log any errors that occur
	form.on('error', function (err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function () {
		processoSalvaDocumentoKeyword(uploads);
		res.end('success');
	});

	// parse the incoming request containing the form data
	// form.parse(req);
	form.parse(req);
});
///UPLOADS

function processoSalvaDocumentoKeyword(uploads){
	console.log("fileid.length: " + uploads.fileid.length + " - keyword.length: " + uploads.keyword.length);
	if (uploads.fileid && uploads.fileid.length > 0 && uploads.keyword && uploads.keyword.length > 0) {
		while (uploads.fileid.length > 0) {
			var fid = uploads.fileid.pop();
			salvaDocumentoKeyword(fid, uploads.keyword);
		}
	}
}

function salvaDocumentoKeyword(fileid, kwidArray) {
	//prep
	kv = [];
	for (i = 0; i < kwidArray.length; i++) {
		kv[i] = { documento_id: fileid, keyword_id: kwidArray[i] };
	}
	//end prep
	DocumentoKeyword.createDocumentoKeyword(kv, function (err) {
		if (err) {
			console.log(err);
		} else {
			// console.log("kv salvo:");
			// console.log(kv);
		}
	});
}

module.exports = router;