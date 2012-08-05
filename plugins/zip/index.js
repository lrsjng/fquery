/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	_ = require('underscore'),
	moment = require('moment'),

	files = ['jszip.js', 'jszip-deflate.js', 'jszip-inflate.js', 'jszip-load.js'],
	sandbox = {},
	JSZip;


_.each(files, function (file) {

	vm.runInNewContext(fs.readFileSync(__dirname + '/' + file, 'utf-8'), sandbox, file);
});


JSZip = sandbox.JSZip;



module.exports = function (fQuery) {

	return  {

		zip: function (mapper) {


			fQuery.info({
				method: 'zip',
				message: 'not available yet',
				fquery: this
			});

			return this;



			// var fquery = this,
			// 	zip = new JSZip();

			// this.each(function (blob) {

			// 	try {
			// 		zip.file(path.basename(blob.source), blob.content);

			// 	} catch (err) {
			// 		fQuery.error({
			// 			method: 'zip',
			// 			message: err.toString(),
			// 			fquery: fquery,
			// 			blob: blob,
			// 			data: err
			// 		});
			// 	}
			// });

			// var blob = fQuery.virtualBlob('zip-' + fQuery.uid(), undefined, moment());
			// blob.buffer = new Buffer(zip.generate({base64: false, compression: 'DEFLATE'}));
			// console.log(blob.buffer);
			// this.pushStack(blob);

			// return this;
		}
	};
};
