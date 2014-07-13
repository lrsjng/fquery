/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.DELETE = function (filepath) {

		return fQuery.Blob.DELETE(filepath);
	};

	fQuery.fn.DELETE = function () {

		return this.each(function (blob) {

			blob.DELETE();
		});
	};
};
