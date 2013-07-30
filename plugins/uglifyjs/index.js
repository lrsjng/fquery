/*jshint node: true */
'use strict';

var _ = require('underscore'),
	UglifyJS = require('uglify-js'),
	compressor = UglifyJS.Compressor({
		unused: false,
		side_effects: false
		// warnings: false
	}),

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
						ast = UglifyJS.parse(blob.content, {filename: blob.source});

					ast.figure_out_scope();
					ast = ast.transform(compressor);
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();

					blob.content = header + ast.print_to_string();

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
