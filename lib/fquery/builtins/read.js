/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.read = function () {

		this.get().forEach(function (blob) {

			blob.read();
		});
		return this;
	};

	fQuery.fn.thenRead = function () {

		return this.then(function () {

			return this.read();
		});
	};
};
