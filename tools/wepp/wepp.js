/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore'),
	fQuery = require('fquery'),
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
				f.cssmin({
					linebreak: options.linebreak
				});
			}

		} else if (ext === '.js') {

			fQuery.info({ method: 'js' + compressionMark, message: message });
			f.includify();
			if (options.compression) {
				f.uglifyjs({
					linebreak: options.linebreak
				});
			}
		} else {

			fQuery.error({ method: 'processFile', message: 'unsupported extension: ' + ext });
		}

		if (!options.stripHeader) {
			f.wrap(header, '');
		}
		if (options.overwrite) {
			f.write(fQuery.OVERWRITE, outFile);
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

		fQuery.info({ method: 'processDir', message: inDir + ' -> ' + outDir });

		if (!inDir || !outDir) {
			fQuery.error({ method: 'processFile', message: 'input and output file must be specified' });
		}

		fQuery(inDir + ': **/*.css, **/*.less, **/*.js, ! inc/**, ! lib/**').each(function (blob) {

			var inFile = blob.source,
				outFile = inFile.replace(inDir, outDir).replace(/\.less$/, '.css');

			processFile(options, inFile, outFile);
		});
	};


module.exports = {
	processFile: processFile,
	processDir: processDir
};
