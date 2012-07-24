/*jshint node: true */
'use strict';

var _ = require('underscore');


module.exports = function (fQuery) {

	return {

		modified: function (arg, deps, keepAll) {

			var modified = [],
				depsModified = false;

			if (_.isString(arg)) {

				var blob = fQuery(arg).get(0);

				if (!blob) {
					modified = this.get();
				} else {
					var stamp = blob.timestamp.valueOf();

					this.each(function () {

						if (this.timestamp.valueOf() >= stamp) {
							modified.push(this);
						}
					});

					if (!modified.length && deps) {
						_.each(fQuery(deps), function (depBlob) {
							if (depBlob.timestamp.valueOf() >= stamp) {
								depsModified = true;
							}
						});
					}
				}
			}

			if (_.isFunction(arg)) {

				this.each(function () {

					var blob = this,
						targetBlob = fQuery(arg.call(this)).get(0);

					if (!targetBlob || blob.timestamp.valueOf() >= targetBlob.timestamp.valueOf()) {
						modified.push(blob);
					} else if (deps) {

						var stamp = targetBlob.timestamp.valueOf();

						_.each(fQuery(deps), function (depBlob) {

							if (depBlob.timestamp.valueOf() >= stamp) {
								modified.push(blob);
							}
						});
					}
				});
			}

			if (depsModified) {
				return this.pushStack(this.get());
			}
			if (modified.length && keepAll) {
				return this.pushStack(this.get());
			}

			return this.pushStack(modified);
		}
	};
};
