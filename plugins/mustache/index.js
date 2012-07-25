/*jshint node: true */
'use strict';

var _ = require('underscore'),
	mustache = require('mustache');


module.exports = function (fQuery) {

	return {

		mustache: function (view) {

			var fquery = this;

			return this.edit(function (blob) {

				try {
					blob.content = mustache.to_html(blob.content, view); // still on version 0.4.0 at npm
					// blob.content = mustache.render(blob.content, view); // version 0.5.x
				} catch (err) {
					fQuery.error({
						method: 'mustache',
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
