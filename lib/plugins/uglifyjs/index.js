/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var _ = require('underscore'),

		reHeaderComment = /^\s*(\/\*((.|\n|\r)*?)\*\/)/,
		getHeaderComment = function (arg, content) {

			if (arg === '!') {
				arg = /^!/;
			}
			if (_.isString(arg)) {
				return arg;
			}
			if (!_.isRegExp(arg)) {
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
			header: '!',
			compressor: {},
			beautifier: {}
		};


	return {

		uglifyjs: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options),
				UglifyJS = require('uglify-js'),
				compressor = UglifyJS.Compressor(settings.compressor);

			return this.edit(function (blob) {

				try {

					var header = getHeaderComment(settings.header, blob.content),
						ast = UglifyJS.parse(blob.content, {filename: blob.source});

					ast.figure_out_scope();
					ast = ast.transform(compressor);
					ast.figure_out_scope();
					ast.compute_char_frequency();
					ast.mangle_names();

					blob.content = header + ast.print_to_string(settings.beautifier);

				} catch (err) {
					fQuery.Event.error({
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
