/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.mkdirp = function (dirpath) {

		return fQuery.Blob.mkdirp(dirpath).isDirectory();
	};
};
