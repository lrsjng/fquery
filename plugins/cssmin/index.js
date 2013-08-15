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

		cached_YAHOO = null,
		lazy_YAHOO = function () {

			if (cached_YAHOO) {
				return cached_YAHOO;
			}

			var fs = require('fs'),
				path = require('path'),
				vm = require('vm'),
				cssmin_content = fs.readFileSync(path.resolve(__dirname, 'cssmin.js'), 'utf-8'),
				sandbox = {};

			vm.runInNewContext(cssmin_content, sandbox, 'cssmin.js');
			cached_YAHOO = sandbox.YAHOO;

			return cached_YAHOO;
		},

		defaults = {
			header: '!',
			linebreak: -1
		};


	return {

		cssmin: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options),
				YAHOO = lazy_YAHOO();

			return this.edit(function (blob) {

				try {

					var header = getHeaderComment(settings.header, blob.content),
						minified = YAHOO.compressor.cssmin(blob.content, settings.linebreak);

					minified = minified.replace(reHeaderComment, '');

					blob.content = header + minified;

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
