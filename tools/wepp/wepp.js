/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore'),
	fQuery = require('../../lib/fQuery'),
	gzipjs = require('gzip-js'),

	getHeaderComment = function (content) {

		return content.match(/^\s*\/\*/) ? content.substr(0, content.indexOf('*/') + 2).trim() + '\n' : '';
	},

	gzip = function (content) {

		// returns an array of bytes
		return gzipjs.zip(content, {level: 5});
	},

	processFile = function (options, inFile, outFile) {

		if (!inFile || !outFile) {
			fQuery.error({ method: 'processFile', message: 'input and output file must be specified' });
		}

		var ext = path.extname(inFile),
			f = fQuery(inFile),
			header = getHeaderComment(f.content()),
			compressionMark = options.compression ? '+min' : '',
			message = inFile + ' -> ' + outFile;

		if (ext === '.css' || ext === '.less') {

			fQuery.info({ method: 'css' + compressionMark, message: message });
			f.less();
			if (options.compression) {
				f.cssmin();
			}

		} else if (ext === '.js') {

			fQuery.info({ method: 'js' + compressionMark, message: message });
			f.includify();
			if (options.compression) {
				f.uglifyjs();
			}
		} else {

			fQuery.error({ method: 'processFile', message: 'unsupported extension: ' + ext });
		}

		if (!options.stripHeader) {
			f.wrap(header, '');
		}
		if (options.overwrite) {
			f.WRITE(outFile);
		} else {
			f.write(outFile);
		}

		if (options.size) {
			var content = f.content(),
				bytesDest = content.length,
				bytesGzip = gzip(content).length;

			fQuery.info({ method: 'size', message: bytesDest + ' bytes (~' + bytesGzip + ' zipped)' });
		}
	},

	processDir = function (options, inDir, outDir) {

		if (!inDir || !outDir) {
			fQuery.error({ method: 'processDir', message: 'input and output dir must be specified' });
		}

		fQuery.info({ method: 'processDir', message: inDir + ' -> ' + outDir });

		fQuery(inDir + ': **/*.css, **/*.less, **/*.js, ! inc/**, ! lib/**').each(function (blob) {

			var inFile = blob.source,
				outFile = inFile.replace(inDir, outDir).replace(/\.less$/, '.css');

			processFile(options, inFile, outFile);
		});
	},

	processOptions = function (options) {

		try {

			if (options.inFile && options.outFile) {

				options.inFile = path.resolve(options.inFile);
				options.outFile = path.resolve(options.outFile);
				wepp.processFile(options, options.inFile, options.outFile);

			} else if (options.inDir && options.outDir) {

				options.inDir = path.resolve(options.inDir);
				options.outDir = path.resolve(options.outDir);
				wepp.processDir(options, options.inDir, options.outDir);

			} else {

				fQuery.error({ method: 'wepp', message: 'either input and output file or input and output directory must be specified' });

			}

		} catch (err) {
			process.stdout.write(err.toString());
		}
	};


module.exports = {
	processFile: processFile,
	processDir: processDir,
	process: processOptions
};
