/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.edit = function (fn) {

		var fquery = this,
			clone = fQuery(this.get().map(function (blob) { return blob.clone(); })),
			deferred, promise;

		if (!fn.length) {
			promise = q(fn.call(clone));
		} else {
			deferred = q.defer();
			fn.call(clone, deferred.resolve, deferred.reject);
			promise = deferred.promise;
		}

		return promise.then(function (blobs) {

			if (blobs === undefined) {
				blobs = clone;
			}

			fquery.push(blobs);
		});
	};

	fQuery.fn.editEach = function (fn, skipNoContent) {

		return this.edit(function () {

			var promises = this.get().map(function (blob, idx) {

					if (skipNoContent && blob.content === undefined) {
						return q();
					}

					if (fn.length < 3) {
						return q(fn.call(this, blob, idx));
					}

					var deferred = q.defer();
					fn.call(this, blob, idx, deferred.resolve, deferred.reject);
					return deferred.promise;
				}, this);

			return q.all(promises);
		});
	};

	fQuery.fn.thenEdit = function (fn) {

		return this.then(function () {

			return this.edit(fn);
		});
	};

	fQuery.fn.thenEditEach = function (fn, skipNoContent) {

		return this.then(function () {

			return this.editEach(fn, skipNoContent);
		});
	};
};
