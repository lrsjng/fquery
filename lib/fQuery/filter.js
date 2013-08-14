/*jshint node: true */
'use strict';

var _ = require('underscore');


module.exports = function (fQuery) {


	var depsNewerThanTarget = function (depsStamps, targetStamp) {

		for (var i = 0, l = depsStamps.length; i < l; i += 1) {
			if (depsStamps[i] >= targetStamp) {
				return true;
			}
		}
		return false;
	};


	return {

		eq: function (idx) {

			return this.pushStack(this.get(idx));
		},

		first: function () {

			return this.eq(0);
		},

		last: function () {

			return this.eq(-1);
		},

		not: function (arg) {

			var blobs = [],
				paths = {};

			_.each(fQuery(arg), function (blob) {

				paths[blob.source] = true;
			});

			this.each(function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		// actually not a filter, but related to `not`
		add: function (arg) {

			var blobs = [],
				paths = {};

			this.each(function (blob) {

				blobs.push(blob);
				paths[blob.source] = true;
			});

			_.each(fQuery(arg), function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		oldest: function () {

			var blobs = [];

			this.each(function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		newest: function () {

			var blobs = [];

			this.each(function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		newerThan: function (arg, deps, keepAll) {

			var keepThisBlobs = [],
				depsStamps = _.map(fQuery(deps), function (blob) { return blob.timestamp.valueOf(); });

			this.each(function (blob, idx, fquery) {

				var target = arg,
					targetBlob;

				if (_.isFunction(target)) {
					target = target.call(blob, blob, idx, fquery);
				}

				targetBlob = fQuery(target).get(0);

				if (!targetBlob) {
					keepThisBlobs.push(blob);
				} else {
					var targetStamp = targetBlob.timestamp.valueOf();

					if (blob.timestamp.valueOf() >= targetStamp || depsNewerThanTarget(depsStamps, targetStamp)) {
						keepThisBlobs.push(blob);
					}
				}
			});

			if (keepAll && keepThisBlobs.length) {
				return this.pushStack(this.get());
			}

			return this.pushStack(keepThisBlobs);
		},

		// Deprecated. Use `newerThan` filter.
		modified: function (arg, deps, keepAll) {

			return this.newerThan(arg, deps, keepAll);
		}
	};
};
