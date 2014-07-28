/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.isPending = function (fn) {

		this._promise = this._promise || fQuery.Q();
		return this._promise.isPending();
	};

	fQuery.fn.getPromise = function () {

		this._promise = this._promise || fQuery.Q();
		return this._promise;
	};

	fQuery.fn.then = function (fn) {

		var fquery = this;

		this._promise = this._promise || fQuery.Q();
		this._promise = this._promise.then(function () {

			if (!fn.length) {
				var result = fn.call(fquery);
				// don't misinterpret fquery results as promise because it is a thenable
				return fQuery.Q(result instanceof fQuery ? null : result);
			}

			var deferred = fQuery.Q.defer();
			fn.call(fquery, deferred.resolve, deferred.reject);
			return deferred.promise;
		});

		return this;
	};
};
