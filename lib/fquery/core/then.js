/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.isPending = function (fn) {

		return !!this._promise && this._promise.isPending();
	};

	fQuery.fn.then = function (fn) {

		var fquery = this;

		if (!this._promise) {
			this._promise = q();
		}

		this._promise = this._promise.then(function () {

			if (!fn.length) {
				var result = fn.call(fquery);
				// don't misinterpret fquery results as promise because it is a thenable
				return q(result instanceof fQuery ? null : result);
			}

			var deferred = q.defer();
			fn.call(fquery, deferred.resolve, deferred.reject);
			return deferred.promise;
		});

		return this;
	};
};
