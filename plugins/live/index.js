/*jshint node: true */
'use strict';

var fs = require('fs'),
	_ = require('underscore'),

	live_content = fs.readFileSync(__dirname + '/live-fquery.js', 'utf-8'),

	live_compressed = (function () {

		var jsp = require('uglify-js').parser,
			pro = require('uglify-js').uglify,
			ast = jsp.parse(live_content); // parse code and get the initial AST

		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		return pro.gen_code(ast); // compressed code here
	}()),

	template = '<script>' + live_compressed + '</script>',

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
