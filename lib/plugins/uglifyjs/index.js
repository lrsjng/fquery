/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.uglifyjs = function (options) {

		var _ = require('underscore'),
			UglifyJS = require('uglify-js'),
			defaults = {
				compressor: {},
				beautifier: {}
			},
			settings = _.extend({}, defaults, options),
			compressor = UglifyJS.Compressor(settings.compressor);

		return this.edit(function (blob) {

			try {

				var ast = UglifyJS.parse(blob.content, {filename: blob.source});

				ast.figure_out_scope();
				ast = ast.transform(compressor);
				ast.figure_out_scope();
				ast.compute_char_frequency();
				ast.mangle_names();

				blob.content = ast.print_to_string(settings.beautifier);

			} catch (err) {
				fQuery.Event.error({
					method: 'uglifyjs',
					message: err.message,
					fquery: this,
					blob: blob,
					line: err.line + 1,
					column: err.col + 1,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenUglifyjs = function (options) {

		return this.then(function () {

			return this.uglifyjs(options);
		});
	};
};
