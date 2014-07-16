/*jshint node: true */
'use strict';


var _ = require('underscore'),
	q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.each = function (fn) {

		return this.then(function (done) {

			var fquery = this,
				promises = _.map(this, function (blob, idx) {

					var deferred = q.defer();

					fn.call(fquery, blob, idx, deferred.resolve);
					if (fn.length < 3) {
						deferred.resolve();
					}

					return deferred.promise;
				});

			q.all(promises).done(done);
		});
	};
};
