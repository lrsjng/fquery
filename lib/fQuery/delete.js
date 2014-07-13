/*jshint node: true */
'use strict';


var Blob = require('../Blob');


module.exports = function (fQuery) {

	fQuery.DELETE = function (filepath) {

		return Blob.DELETE(filepath);
	};

	fQuery.fn.DELETE = function () {

		return this.each(function (blob) {

			blob.DELETE();
		});
	};
};
