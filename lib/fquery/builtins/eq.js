/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	fQuery.fn.eq = function (idx) {

		return this.edit(function () {

			return this.get(idx);
		});
	};


	fQuery.fn.first = function () {

		return this.eq(0);
	};


	fQuery.fn.last = function () {

		return this.eq(-1);
	};
};
