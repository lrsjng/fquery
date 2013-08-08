/*jshint node: true */
'use strict';

var _ = require('underscore'),

	includify = require('./includify'),

	defaults = {
		charset: 'utf-8'
	};


module.exports = function (fQuery) {

	return {

		includify: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {

				try {
					blob.content = includify({ file: blob.source, content: blob.content, charset: settings.charset });
				} catch (err) {
					fQuery.error({
						method: 'includify',
						message: err.message,
						fquery: fquery,
						blob: blob,
						file: err.file,
						line: err.line,
						column: err.column,
						data: err
					});
				}
			});
		}
	};
};
