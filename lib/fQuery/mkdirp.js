/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.mkdirp = function (dirpath) {

		return Blob.mkdirp(dirpath).isDirectory();
	};
};
