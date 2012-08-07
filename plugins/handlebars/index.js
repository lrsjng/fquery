/*jshint node: true */
'use strict';

var _ = require('underscore'),
	handlebars = require('handlebars');


module.exports = function (fQuery) {

	return {

		handlebars: function (data) {

			var fquery = this;

			return this.edit(function (blob) {

				try {
					blob.content = handlebars.compile(blob.content)(data);
				} catch (err) {
					fQuery.error({
						method: 'handlebars',
						message: err.toString(),
						fquery: fquery,
						blob: blob,
						data: err
					});
				}
			});
		}
	};
};
