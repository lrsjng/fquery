/*jshint node: true, strict: false */

var _ = require('underscore'),

	constMsg = 'constant filepath not allowed for more than one selected item',
	strOrFnMsg = 'argument needs to be String or Function';


module.exports = function (fQuery) {

	return {

		read: function () {

			return this.each(function (blob) {

				blob.read();
			});
		},

		write: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function (blob, idx) {

					blob.write(arg.call(blob, blob, idx));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({
						method: 'write',
						message: constMsg,
						fquery: this,
						data: arg
					});
				}

				return this.each(function (blob) {

					blob.write(arg);
				});
			}

			fQuery.error({
				method: 'write',
				message: strOrFnMsg,
				fquery: this,
				data: arg
			});
		},

		copy: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function (blob, idx) {

					blob.copy(arg.call(blob, blob, idx));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({
						method: 'copy',
						message: constMsg,
						fquery: this,
						data: arg
					});
				}

				return this.each(function (blob) {

					blob.copy(arg);
				});
			}

			fQuery.error({
				method: 'copy',
				message: strOrFnMsg,
				fquery: this,
				data: arg
			});
		},

		remove: function () {

			return this.each(function (blob) {

				blob.remove();
			});
		},

		move: function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function (blob, idx) {

					blob.move(arg.call(blob, blob, idx));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({
						method: 'move',
						message: constMsg,
						fquery: this,
						data: arg
					});
				}

				return this.each(function (blob) {

					blob.move(arg);
				});
			}

			fQuery.error({
				method: 'move',
				message: strOrFnMsg,
				fquery: this,
				data: arg
			});
		}
	};
};
