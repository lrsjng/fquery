/*jshint node: true */
'use strict';

var _ = require('underscore'),
	jsp = require('uglify-js').parser,
	pro = require('uglify-js').uglify,

	defaults = {
		linebreak: 32 * 1024
	};


module.exports = function (fQuery) {

	return {

		uglifyjs: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {

				try {

					// parse code and get the initial AST
					var ast = jsp.parse(blob.content);

					// get a new AST with mangled names
					ast = pro.ast_mangle(ast);

					// get an AST with compression optimizations
					ast = pro.ast_squeeze(ast);

					// compressed code here
					var final_code = pro.gen_code(ast);

					if (settings.linebreak > 0) {
						final_code = pro.split_lines(final_code, settings.linebreak);
					}

					blob.content = final_code;

				} catch (err) {
					fQuery.error({
						method: 'uglifyjs',
						message: err.message,
						fquery: fquery,
						blob: blob,
						line: err.line + 1,
						column: err.col + 1,
						data: err
					});
				}
			});
		}
	};
};
