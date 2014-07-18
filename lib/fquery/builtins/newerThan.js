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

		var blobs = [];

		this.each(function (blob) {

			if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
				blobs = [blob];
			} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
				blobs.push(blob);
			}
		});

		return this.push(blobs);
	};

	fQuery.fn.newest = function () {

		var blobs = [];

		this.each(function (blob) {

			if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
				blobs = [blob];
			} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
				blobs.push(blob);
			}
		});

		return this.push(blobs);
	};

	fQuery.fn.newerThan = function (arg, deps, keepAll) {

		var keepThisBlobs = [],
			depsStamps = fQuery(deps).map(function (blob) { return blob.timestamp.valueOf(); });

		this.each(function (blob, idx) {

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
			keepThisBlobs = this;
		}

		return this.push(keepThisBlobs);
	};
};
