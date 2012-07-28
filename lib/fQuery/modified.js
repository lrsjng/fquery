/*jshint node: true */
'use strict';

var _ = require('underscore');



module.exports = function (fQuery) {

	var createDepStamps = function (deps) {

		var array = [];

		fQuery(deps).each(function (blob) {

			array.push(blob.timestamp.valueOf());
		});

		return array;
	};

	var depsNewerThanTarget = function (depsStamps, targetStamp) {

		for (var i = 0, l = depsStamps.length; i < l; i += 1) {
			if (depsStamps[i] >= targetStamp) {
				return true;
			}
		}
		return false;
	};

	return {

		modified: function (arg, deps, keepAll) {

			var modified = [],
				depsStamps = createDepStamps(deps);

			if (_.isString(arg)) {

				var targetBlob = fQuery(arg).get(0);

				this.each(function (blob) {

					if (!targetBlob) {
						modified.push(blob);
					} else {
						var targetStamp = targetBlob.timestamp.valueOf();

						if (blob.timestamp.valueOf() >= targetStamp || depsNewerThanTarget(depsStamps, targetStamp)) {
							modified.push(blob);
						}
					}
				});
			}

			if (_.isFunction(arg)) {

				this.each(function (blob, idx, fquery) {

					var targetBlob = fQuery(arg.call(blob, blob, idx, fquery)).get(0);

					if (!targetBlob) {
						modified.push(blob);
					} else {
						var targetStamp = targetBlob.timestamp.valueOf();

						if (blob.timestamp.valueOf() >= targetStamp || depsNewerThanTarget(depsStamps, targetStamp)) {
							modified.push(blob);
						}
					}
				});
			}

			if (keepAll && modified.length) {
				return this.pushStack(this.get());
			}

			return this.pushStack(modified);
		}
	};
};
