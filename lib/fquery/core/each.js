/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.each = function (fn) {

		var deferred = q.defer(),
			promises = this.get().map(function (blob, idx) {

				var deferred = q.defer();

				fn.call(this, blob, idx, deferred.resolve);
				if (fn.length < 3) {
					deferred.resolve();
				}

				return deferred.promise;
			}, this);

		q.all(promises).done(deferred.resolve);
		return deferred.promise;
	};

	fQuery.fn.thenEach = function (fn) {

		return this.then(function (done) {

			this.each(fn).then(done);
		});
	};
};
