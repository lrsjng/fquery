/*jshint node: true */
'use strict';


var rimraf = require('rimraf');


module.exports = function (fQuery) {

	fQuery.fn.delete = function () {

		this.get().forEach(function (blob) {

			try {
				rimraf.sync(blob.source);
				fQuery.Event.ok({
					method: 'delete',
					message: blob.source,
					fquery: this,
					blob: blob
				});
			} catch (err) {
				fQuery.Event.error({
					method: 'delete',
					message: err.toString(),
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
		return this;
	};

	fQuery.fn.thenDelete = function () {

		return this.then(function () {

			return this.delete();
		});
	};
};
