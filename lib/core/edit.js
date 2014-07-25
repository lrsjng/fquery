/*jshint node: true */
'use strict';


var q = require('q');


module.exports = function (fQuery) {

	fQuery.fn.edit = function (fn, skipNoContent) {

		return this.push(this.clone().each(function (blob, idx) {

			if (skipNoContent && blob.content === undefined) {
				return;
			}

			fn.call(this, blob, idx);
		}));
	};

	fQuery.fn.asyncEdit = function (fn, skipNoContent) {

		var fquery = this,
			clone = this.clone(),
			promises = clone.map(function (blob, idx) {

				if (skipNoContent && blob.content === undefined) {
					return q();
				}

				if (fn.length < 3) {
					return q(fn.call(this, blob, idx));
				}

				var deferred = q.defer();
				fn.call(this, blob, idx, deferred.resolve, deferred.reject);
				return deferred.promise;
			});

		return q.all(promises).then(function (blobs) {

			if (blobs === undefined) {
				blobs = clone;
			}

			fquery.push(blobs);
		});
	};

	fQuery.fn.thenEdit = function (fn, skipNoContent) {

		return this.then(function () {

			return this.asyncEdit(fn, skipNoContent);
		});
	};
};
