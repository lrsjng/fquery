/*jshint node: true, strict: false */

var _ = require('underscore'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify;


module.exports = {

	uglifyjs: function (options) {

		var self = this;

		return this.edit(function () {

			try {

				// parse code and get the initial AST
				var ast = jsp.parse(this.content);

				// get a new AST with mangled names
				ast = pro.ast_mangle(ast);

				// get an AST with compression optimizations
				ast = pro.ast_squeeze(ast);

				// compressed code here
				var final_code = pro.gen_code(ast);

				this.content = final_code;

			} catch (err) {
				self.error('uglifyjs', err.message, this, err);
			}
		});
	}
};
