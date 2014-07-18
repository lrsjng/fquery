/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.cleancss = function (options) {

		var _ = require('underscore'),
			cleancss = require('clean-css'),
			defaults = {},
			settings = _.extend({}, defaults, options);

		return this.edit(function (blob) {

			try {
				blob.content = cleancss.process(blob.content, settings);

			} catch (err) {
				fQuery.Event.error({
					method: 'cleancss',
					message: 'failed',
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenCleancss = function (options) {

		return this.then(function () {

			return this.cleancss(options);
		});
	};
};
