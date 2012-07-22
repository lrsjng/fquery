/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	return {

		read: function () {

			return this.each(function () {

				this.read();
			});
		},

		write: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function () {

					this.write(arg.call(this));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error('write: constant filepath not allowed for more than one selected items', arg);
				}

				return this.each(function () {

					this.write(arg);
				});
			}

			fQuery.error('write: arg needs to be String or Function', arg);
		},

		copy: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function () {

					this.copy(arg.call(this));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error('copy: constant filepath not allowed for more than one selected items', arg);
				}

				return this.each(function () {

					this.copy(arg);
				});
			}

			fQuery.error('copy: arg needs to be String or Function', arg);
		},

		remove: function () {

			return this.each(function () {

				this.remove();
			});
		},

		move: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function () {

					this.move(arg.call(this));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error('move: constant filepath not allowed for more than one selected items', arg);
				}

				return this.each(function () {

					this.move(arg);
				});
			}

			fQuery.error('move: arg needs to be String or Function', arg);
		}
	};
};
