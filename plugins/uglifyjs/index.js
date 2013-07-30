/*jshint node: true */
'use strict';

var _ = require('underscore'),
	UglifyJS = require('uglify-js'),
	compressor = UglifyJS.Compressor(),

	reHeaderComment = /^\s*(\/\*((.|\n|\r)*?)\*\/)/,
	getHeaderComment = function (arg, content) {

		if (arg === '!') {
			arg = /^!/;
		}
		if (arg !== true && !_.isRegExp(arg)) {
			return '';
		}

		var match = content.match(reHeaderComment);
		var header = match ? match[1] + '\n' : '';
		if (match && _.isRegExp(arg) && !match[2].match(arg)) {
			header = '';
		}
		return header;
	},

	defaults = {
		header: true,
		linebreak: 32 * 1024
	};



module.exports = function (fQuery) {

	return {

		uglifyjs: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {


				try {

					var header = getHeaderComment(settings.header, blob.content),
						ast = UglifyJS.parse(blob.content);

					ast.figure_out_scope();
					ast = ast.transform(compressor);
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();

					blob.content = header + ast.print_to_string();

					// // parse code and get the initial AST
					// var ast = jsp.parse(blob.content);

					// // get a new AST with mangled names
					// ast = pro.ast_mangle(ast);

					// // get an AST with compression optimizations
					// ast = pro.ast_squeeze(ast);

					// // compressed code here
					// var final_code = pro.gen_code(ast);

					// if (settings.linebreak > 0) {
					// 	final_code = pro.split_lines(final_code, settings.linebreak);
					// }

					// blob.content = header + final_code;

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
