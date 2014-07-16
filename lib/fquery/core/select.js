/*jshint node: true */
'use strict';


var Selector = require('../Selector'),
	selector = new Selector({files: true, dirs: false, uniq: true, onlyStats: false});


module.exports = function (fQuery) {


	fQuery.fn._select = function (arg, options) {

		this._push(selector.blobs(arg, options));
		return this;
	};


	fQuery.fn.select = function (arg, options) {

		return this.edit(function () {

			return selector.blobs(arg, options);
		});
	};
};
