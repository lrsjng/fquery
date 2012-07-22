/*jshint node: true, strict: false */

var _ = require('underscore'),

	constMsg = 'constant filepath not allowed for more than one selected item',
	strOrFnMsg = 'argument needs to be String or Function';


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
					return this.error('write', constMsg, undefined, arg);
				}

				return this.each(function () {

					this.write(arg);
				});
			}

			return this.error('write', strOrFnMsg, undefined, arg);
		},

		copy: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function () {

					this.copy(arg.call(this));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					return this.error('copy', constMsg, undefined, arg);
				}

				return this.each(function () {

					this.copy(arg);
				});
			}

			return this.error('copy', strOrFnMsg, undefined, arg);
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
					return this.error('move', constMsg, undefined, arg);
				}

				return this.each(function () {

					this.move(arg);
				});
			}

			return this.error('move', strOrFnMsg, undefined, arg);
		}
	};
};
