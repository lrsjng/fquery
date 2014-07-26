/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.mkdirp = function (dirpath) {

		var mkdirp = require('mkdirp');

		try {
			mkdirp.sync(dirpath);
			fQuery.Event.ok({
				method: 'mkdirp',
				message: dirpath
			});
		} catch (err) {
			fQuery.Event.error({
				method: 'mkdirp',
				message: err.toString(),
				data: err
			});
		}
		return fQuery(dirpath, {dirs: true});
	};
};
