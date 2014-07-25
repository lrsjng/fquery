/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.eq = function (idx) {

		return this.push(this.get(idx));
	};

	fQuery.fn.thenEq = function (idx) {

		return this.then(function () {

			return this.eq(idx);
		});
	};

	fQuery.fn.first = function () {

		return this.eq(0);
	};

	fQuery.fn.thenFirst = function () {

		return this.thenEq(0);
	};

	fQuery.fn.last = function () {

		return this.eq(-1);
	};

	fQuery.fn.thenLast = function () {

		return this.thenEq(-1);
	};
};
