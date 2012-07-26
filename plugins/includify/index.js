/*jshint node: true */
'use strict';

var _ = require('underscore'),

	includify = require('./includify');


module.exports = function (fQuery) {

	return {

		includify: function (options) {

			var fquery = this;

			return this.edit(function (blob) {

				try {
					blob.content = includify({ file: blob.source, content: blob.content });
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
