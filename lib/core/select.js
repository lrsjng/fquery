/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var selector = new fQuery.Selector({files: true, dirs: false, uniq: true, onlyStats: false});

	fQuery.fn.select = function (arg, options) {

		return this.push(selector.blobs(arg, options));
	};

	fQuery.fn.thenSelect = function (arg, options) {

		return this.then(function () {

			this.select(arg, options);
		});
	};
};
