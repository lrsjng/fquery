/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var cached_YAHOO = null,
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
		};

	fQuery.fn.cssmin = function (options) {

		var _ = require('underscore'),
			defaults = {
				linebreak: -1
			},
			settings = _.extend({}, defaults, options),
			YAHOO = lazy_YAHOO();

		return this.edit(function (blob) {

			try {
				blob.content = YAHOO.compressor.cssmin(blob.content, settings.linebreak);

			} catch (err) {
				fQuery.Event.error({
					method: 'cssmin',
					message: 'failed',
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenCssmin = function (options) {

		return this.then(function () {

			return this.cssmin(options);
		});
	};
};
