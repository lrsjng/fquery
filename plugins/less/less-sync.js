/*jshint node: true */
'use strict';

var path = require('path'),
	fs = require('fs'),
	util = require('util'),
	less = require('less');


module.exports = function (filepath, content, compress) {

	var parser = new(less.Parser)({
		paths: [path.dirname(filepath)], // Specify search paths for @import directives
		filename: filepath // Specify a filename, for better error messages
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


less.Parser.importer = function (file, paths, callback) {
	var pathname;

	paths.unshift('.');

	for (var i = 0; i < paths.length; i += 1) {
		try {
			pathname = path.join(paths[i], file);
			fs.statSync(pathname);
			break;
		} catch (e) {
			pathname = null;
		}
	}

	if (pathname) {
		var data;

		try {
			data = fs.readFileSync(pathname, 'utf-8');
		} catch (e) {
			throw {msg: "file '" + file + "' wasn't found.\n", file: file};
		}

		new (less.Parser)({
			paths: [path.dirname(pathname)].concat(paths),
			filename: pathname
		}).parse(data, function (e, root) {
			if (e) {
				throw e;
			}
			callback(root);
		});

	} else {
		throw {msg: "file '" + file + "' wasn't found.\n", file: file};
	}
};
