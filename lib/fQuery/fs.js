/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.extend({

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
					fQuery.error(4, 'constant path not allowed for more than one selected items');
				}

				return this.each(function () {

					this.write(arg);
				});
			}

			fQuery.error(5, 'path needs to be String or Function');
		},

		copy: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function () {

					this.copy(arg.call(this));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error(4, 'constant path not allowed for more than one selected items');
				}

				return this.each(function () {

					this.copy(arg);
				});
			}

			fQuery.error(5, 'path needs to be String or Function');
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
					fQuery.error(4, 'constant path not allowed for more than one selected items');
				}

				return this.each(function () {

					this.move(arg);
				});
			}

			fQuery.error(5, 'path needs to be String or Function');
		}
	});
};
