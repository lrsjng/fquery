/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var selector = new fQuery.Selector({files: true, dirs: false, uniq: true, onlyStats: false});

	fQuery.fn.select = function (arg, options) {

		this.push(selector.blobs(arg, options));
		return this;
	};

	fQuery.fn.thenSelect = function (arg, options) {

		return this.edit(function () {

			return selector.blobs(arg, options);
		});
	};
};
