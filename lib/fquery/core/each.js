/*jshint node: true */
'use strict';


var _ = require('underscore'),
	q = require('q');


module.exports = function (fQuery) {


	fQuery.fn.each_instant = function (fn) {

		var fquery = this,
			deferred = q.defer(),

			promises = _.map(this, function (blob, idx) {

				var deferred = q.defer();

				fn.call(fquery, blob, idx, deferred.resolve);
				if (fn.length < 3) {
					deferred.resolve();
				}

				return deferred.promise;
			});

		q.all(promises).done(deferred.resolve);
		return deferred.promise;
	};


	fQuery.fn.each = function (fn) {

		return this.then(function (done) {

			this.each_instant(fn).then(done);
		});
	};
};
