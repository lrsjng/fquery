/*jshint node: true */
'use strict';


var rimraf = require('rimraf');


module.exports = function (fQuery) {


	fQuery.delete = function (filepath) {

		try {
			rimraf.sync(filepath);
			fQuery.Event.ok({
				method: 'delete',
				message: filepath
			});
			return true;
		} catch (err) {
			fQuery.Event.error({
				method: 'delete',
				message: err.toString(),
				data: err
			});
		}
	};


	fQuery.fn.delete = function () {

		return this.each(function (blob) {

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
	};
};
