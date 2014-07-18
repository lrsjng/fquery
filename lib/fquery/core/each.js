/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.asyncEach = function (fn) {

		var promises = this.map(function (blob, idx) {

				if (fn.length < 3) {
					return q(fn.call(this, blob, idx));
				}

				var deferred = q.defer();
				fn.call(this, blob, idx, deferred.resolve, deferred.reject);
				return deferred.promise;
			});

		return q.all(promises);
	};

	fQuery.fn.thenEach = function (fn) {

		return this.then(function () {

			return this.asyncEach(fn);
		});
	};
};
