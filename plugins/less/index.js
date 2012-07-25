/*jshint node: true */
'use strict';

var _ = require('underscore'),
	less = require('./less-sync');


module.exports = function (fQuery) {

	return {

		less: function (options) {

			var fquery = this;

			return this.edit(function (blob) {

				try {
					blob.content = less(blob.source, blob.content, false);
				} catch (err) {
					fQuery.error({
						method: 'less',
						message: err.name + ', ' + err.message,
						fquery: fquery,
						blob: blob,
						file: err.filename,
						line: err.line,
						column: err.column + 1,
						data: err
					});
				}
			});
		}
	};
};
