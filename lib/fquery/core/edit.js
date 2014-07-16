/*jshint node: true */
'use strict';


var _ = require('underscore'),
	q = require('q');


module.exports = function (fQuery) {


	fQuery.fn.edit = function (fn) {

		return this.then(function (done) {

			var fquery = this,
				clone = fQuery(_.map(fquery, function (blob) { return blob.clone(); })),
				deferred = q.defer(),
				result = fn.call(clone, deferred.resolve);

			if (fn.length < 1) {
				deferred.resolve(result);
			}

			deferred.promise.then(function (blobs) {

				if (blobs === undefined) {
					blobs = clone;
				}

				fquery._push(blobs);
				done();
			});
		});
	};


	fQuery.fn.editEach = function (fn, withBinaries) {

		return this.edit(function (done) {

			var fquery = this,
				promises = _.map(fquery, function (blob, idx) {

					var deferred = q.defer();

					if (withBinaries || blob.content !== undefined) {
						fn.call(fquery, blob, idx, deferred.resolve);
						if (fn.length < 3) {
							deferred.resolve();
						}
					} else {
						deferred.resolve();
					}

					return deferred.promise;
				});

			q.all(promises).done(function () {

				done();
			});
		});
	};
};
