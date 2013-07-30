/*jshint node: true */
'use strict';

var path = require('path'),
	fs = require('fs'),
	util = require('util'),
	less = require('less');


module.exports = function (filepath, content, compress) {

	var parser = new(less.Parser)({
			paths: [path.dirname(filepath)], // Specify search paths for @import directives
			filename: filepath, // Specify a filename, for better error messages
			syncImport: true // now supports sync import itself
		});

	var result;

	// `parser.parse` is sync if `Parser.importer` is sync
	parser.parse(content, function (e, tree) {

		if (e) {
			throw e;
		}
		result = tree.toCSS({ compress: !!compress });
	});

	return result;
};
