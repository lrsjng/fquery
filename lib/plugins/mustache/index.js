/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.mustache = function (view) {

		var mustache = require('mustache');

		return this.edit(function (blob) {

			try {
				blob.content = mustache.render(blob.content, view);
			} catch (err) {
				fQuery.Event.error({
					method: 'mustache',
					message: err.toString(),
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenMustach = function (view) {

		return this.then(function () {

			return this.mustache(view);
		});
	};
};
