/*jshint node: true */
'use strict';

var _ = require('underscore'),
	csscondense = require('css-condense'),

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

		// csscondense keeps them anyway
		if (match && match[2].match(/^!/)) {
			header = '';
		}

		if (match && _.isRegExp(arg) && !match[2].match(arg)) {
			header = '';
		}
		return header;
	},

	defaults = {
		header: '!'
	};



module.exports = function (fQuery) {

	return  {

		csscondense: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {

				try {

					var header = getHeaderComment(settings.header, blob.content);

					blob.content = header + csscondense.compress(blob.content, settings);

				} catch (err) {
					fQuery.error({
						method: 'csscondense',
						message: 'failed',
						fquery: fquery,
						blob: blob,
						data: err
					});
				}
			});
		}
	};
};
