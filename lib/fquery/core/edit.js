/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.edit = function (fn) {

		var fquery = this,
			clone = fQuery(this.get().map(function (blob) { return blob.clone(); })),
			deferred = q.defer(),
			result = fn.call(clone, deferred.resolve);

		deferred.promise.then(function (blobs) {

			if (blobs === undefined) {
				blobs = clone;
			}

			fquery.push(blobs);
		});

		if (fn.length < 1) {
			deferred.resolve(result);
		}

		return deferred.promise;
	};

	fQuery.fn.editEach = function (fn, withBinaries) {

		return this.edit(function (done) {

			var promises = this.get().map(function (blob, idx) {

					var deferred = q.defer();

					if (withBinaries || blob.content !== undefined) {
						fn.call(this, blob, idx, deferred.resolve);
						if (fn.length < 3) {
							deferred.resolve();
						}
					} else {
						deferred.resolve();
					}

					return deferred.promise;
				}, this);

			q.all(promises).then(function () {

				done();
			});
		});
	};

	fQuery.fn.thenEdit = function (fn) {

		return this.then(function (done) {

			this.edit(fn).then(done);
		});
	};

	fQuery.fn.thenEditEach = function (fn, withBinaries) {

		return this.then(function (done) {

			this.editEach(fn, withBinaries).then(done);
		});
	};
};
