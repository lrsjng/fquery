/*jshint node: true */
'use strict';

var fs = require('fs'),
	_ = require('underscore'),

	live_content = fs.readFileSync(__dirname + '/live-fquery.js', 'utf-8'),

	live_compressed = (function () {

		var UglifyJS = require('uglify-js'),
			compressor = UglifyJS.Compressor(),
			ast = UglifyJS.parse(live_content);

		ast.figure_out_scope();
		ast = ast.transform(compressor);
		ast.figure_out_scope();
		ast.compute_char_frequency();
		ast.mangle_names();

		return ast.print_to_string();
	}()),

	template = '<script>' + live_compressed + '</script>',
	// template = '<script>' + live_content + '</script>',

	defaults = {
		// 'countUp' or 'updated' or null
		hint: 'countUp'
	};


module.exports = function (fQuery) {

	return {

		live: function (options) {

			fQuery.info({
				method: 'live',
				message: 'not available yet',
				fquery: this
			});

			return this;

			// var fquery = this,
			// 	settings = _.extend({}, defaults, options),
			// 	script = template.replace('LIVE_HINT', '"' + settings.hint + '"');

			// return this.edit(function (blob) {

			// 	try {

			// 		blob.content = blob.content.replace('</head>', script + '</head>');

			// 	} catch (err) {
			// 		fQuery.error({
			// 			method: 'live',
			// 			message: err.toString(),
			// 			fquery: fquery,
			// 			blob: blob,
			// 			data: err
			// 		});
			// 	}
			// });
		}
	};
};
