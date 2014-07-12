/*jshint node: true */
'use strict';


var _ = require('underscore'),

	depsNewerThanTarget = function (depsStamps, targetStamp) {

		for (var i = 0, l = depsStamps.length; i < l; i += 1) {
			if (depsStamps[i] >= targetStamp) {
				return true;
			}
		}
		return false;
	};


module.exports = function (fQuery) {

	return {

		eq: function (idx) {

			return this.then(function () {

				this.push_instant(this.get(idx));
			});
		},

		first: function () {

			return this.eq(0);
		},

		last: function () {

			return this.eq(-1);
		},

		not: function (arg) {

			return this.then(function () {

				var blobs = [],
					paths = {};

				fQuery(arg).each_instant(function (blob) {

					paths[blob.source] = true;
				});

				this.each_instant(function (blob) {

					if (!paths[blob.source]) {
						blobs.push(blob);
					}
				});

				this.push_instant(blobs);
			});
		},

		// actually not a filter, but related to `not`
		add: function (arg) {

			return this.then(function () {

				var blobs = [],
					paths = {};

				this.each_instant(function (blob) {

					blobs.push(blob);
					paths[blob.source] = true;
				});

				fQuery(arg).each_instant(function (blob) {

					if (!paths[blob.source]) {
						blobs.push(blob);
					}
				});

				this.push_instant(blobs);
			});
		},

		oldest: function () {

			return this.then(function () {

				var blobs = [];

				this.each_instant(function (blob) {

					if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
						blobs = [blob];
					} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
						blobs.push(blob);
					}
				});

				this.push_instant(blobs);
			});
		},

		newest: function () {

			return this.then(function () {

				var blobs = [];

				this.each_instant(function (blob) {

					if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
						blobs = [blob];
					} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
						blobs.push(blob);
					}
				});

				this.push_instant(blobs);
			});
		},

		newerThan: function (arg, deps, keepAll) {

			return this.then(function () {

				var keepThisBlobs = [],
					depsStamps = _.map(fQuery(deps), function (blob) { return blob.timestamp.valueOf(); });

				this.each_instant(function (blob, idx) {

					var target = arg,
						targetBlob,
						targetStamp;

					if (_.isFunction(target)) {
						target = target.call(this, blob, idx);
					}

					targetBlob = fQuery(target).get(0);

					if (!targetBlob) {
						keepThisBlobs.push(blob);
					} else {
						targetStamp = targetBlob.timestamp.valueOf();

						if (blob.timestamp.valueOf() > targetStamp || depsNewerThanTarget(depsStamps, targetStamp)) {
							keepThisBlobs.push(blob);
						}
					}
				});

				if (keepAll && keepThisBlobs.length) {
					keepThisBlobs = this.get();
				}
				this.push_instant(keepThisBlobs);
			});
		}
	};
};
