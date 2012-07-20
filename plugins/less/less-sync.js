/*jshint node: true, strict: false */

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

		// ORIGINAL ASYNC CODE
		// fs.readFile(pathname, 'utf-8', function(e, data) {
		//   if (e) sys.error(e);
		//   new(less.Parser)({
		//       paths: [path.dirname(pathname)].concat(paths),
		//       filename: pathname
		//   }).parse(data, function (e, root) {
		//       if (e) less.writeError(e);
		//       callback(root);
		//   });
		// });

		// SYNC REPLACEMENT
		try {
			var data = fs.readFileSync(pathname, 'utf-8');

			new(less.Parser)({
				paths: [path.dirname(pathname)].concat(paths),
				filename: pathname
			}).parse(data, function (e, root) {
				if (e) {
					less.writeError(e);
				}
				callback(root);
			});
		} catch (e) {
			util.error(e);
		}
		// ENDS HERE

	} else {
		util.error("file '" + file + "' wasn't found.\n");
		process.exit(1);
	}
};
