/*jshint node: true */
'use strict';


var _ = require('underscore'),
	q = require('q');


module.exports = function (fQuery) {


	fQuery.fn.edit_instant = function (fn, all) {

		var fquery = this,
			deferred = q.defer(),

			clones = _.map(this, function (blob) { return blob.clone(); }),

			promises = clones.map(function (blob, idx) {

				var deferred = q.defer();

				if (all || blob.content !== undefined) {
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

			fquery.push_instant(clones);
			deferred.resolve();
		});
		return deferred.promise;
	};


	fQuery.fn.edit = function (fn, all) {

		return this.then(function (done) {

			this.edit_instant(fn).then(done);
		});
	};
};
