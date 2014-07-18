/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.clone = function () {

		return fQuery(this.map(function (blob) { return blob.clone(); }));
	};

	fQuery.fn.thenClone = function () {

		return this.then(function () {

			return this.clone();
		});
	};
};
