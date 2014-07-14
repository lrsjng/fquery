/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.then = function (fn) {

		var fquery = this,
			deferred = q.defer();

		if (!this._promise) {
			this._promise = q();
		}

		this._promise.then(function () {

			fn.call(fquery, deferred.resolve);
			if (fn.length < 1) {
				deferred.resolve();
			}
		});

		this._promise = deferred.promise;
		return this;
	};
};
