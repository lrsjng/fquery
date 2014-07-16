/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	return {

		mustache: function (view) {

			var fquery = this,
				mustache = require('mustache');

			return this.edit(function (blob) {

				try {
					blob.content = mustache.render(blob.content, view);
				} catch (err) {
					fQuery.Event.error({
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
