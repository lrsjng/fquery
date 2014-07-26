/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.includify = function (options) {

		var _ = require('underscore'),
			includify = require('./includify'),
			defaults = {
				charset: 'utf-8'
			},
			settings = _.extend({}, defaults, options);

		return this.edit(function (blob) {

			try {
				blob.content = includify({ file: blob.source, content: blob.content, charset: settings.charset });
			} catch (err) {
				fQuery.Event.error({
					method: 'includify',
					message: err.message,
					fquery: this,
					blob: blob,
					file: err.file,
					line: err.line,
					column: err.column,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenIncludify = function (options) {

		return this.then(function () {

			return this.includify(options);
		});
	};
};
