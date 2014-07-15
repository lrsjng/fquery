/*jshint node: true */
'use strict';


var rimraf = require('rimraf');


module.exports = function (fQuery) {


	fQuery.DELETE = function (filepath) {

		try {
			rimraf.sync(filepath);
			fQuery.Event.ok({
				method: 'DELETE',
				message: filepath
			});
			return true;
		} catch (err) {
			fQuery.Event.error({
				method: 'DELETE',
				message: err.toString(),
				data: err
			});
		}
	};


	fQuery.fn.DELETE = function () {

		return this.each(function (blob) {

			try {
				rimraf.sync(blob.source);
				fQuery.Event.ok({
					method: 'DELETE',
					message: blob.source,
					fquery: this,
					blob: blob
				});
			} catch (err) {
				fQuery.Event.error({
					method: 'DELETE',
					message: err.toString(),
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
	};
};
