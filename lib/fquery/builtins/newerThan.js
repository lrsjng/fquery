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


	fQuery.fn.oldest = function () {

		return this.edit(function () {

			var blobs = [];

			_.each(this, function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return blobs;
		});
	};


	fQuery.fn.newest = function () {

		return this.edit(function (done) {

			var blobs = [];

			_.each(this, function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return blobs;
		});
	};


	fQuery.fn.newerThan = function (arg, deps, keepAll) {

		return this.edit(function () {

			var fquery = this,
				keepThisBlobs = [],
				depsStamps = _.map(fQuery(deps), function (blob) { return blob.timestamp.valueOf(); });

			_.each(fquery, function (blob, idx) {

				var target = arg,
					targetBlob,
					targetStamp;

				if (_.isFunction(target)) {
					target = target.call(fquery, blob, idx);
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

			return keepThisBlobs;
		});
	};
};
