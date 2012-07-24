/*jshint node: true, strict: false */

var _ = require('underscore'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify;


module.exports = function (fQuery) {

	return {

		uglifyjs: function (options) {

			var fquery = this;

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
