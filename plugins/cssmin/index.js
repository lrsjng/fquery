/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	_ = require('underscore'),

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

		// cssmin keeps them anyway
		if (match && match[2].match(/^!/)) {
			header = '';
		}

		if (match && _.isRegExp(arg) && !match[2].match(arg)) {
			header = '';
		}
		return header;
	},

	cssmin_content = fs.readFileSync(path.resolve(__dirname, 'cssmin.js'), 'utf-8'),
	sandbox = {},
	YAHOO,

	defaults = {
		header: '!',
		linebreak: -1
	};



vm.runInNewContext(cssmin_content, sandbox, 'cssmin.js');
YAHOO = sandbox.YAHOO;



module.exports = function (fQuery) {

	return  {

		cssmin: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {

				try {

					var header = getHeaderComment(settings.header, blob.content);

					blob.content = header + YAHOO.compressor.cssmin(blob.content, settings.linebreak);

				} catch (err) {
					fQuery.error({
						method: 'cssmin',
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
