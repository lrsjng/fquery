/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.extend({

		toString: function () {

			var i = 0,
				s = '';

			_.each(this, function (blob) {
				s += '[' + i + '] ' +  blob.toString() + '\n';
				i += 1;
			});

			return s;
		},

		log: function () {

			console.log(this.toString());
			return this;
		},

		push: function (blobs) {

			this._push(blobs);
			return this;
		},

		end: function () {

			this._pop();
			return this;
		},

		eq: function (idx) {

			return this.push(this[idx]);
		},

		get: function (idx) {

			return this[idx];
		},

		add: function (arg) {

			var list = [],
				paths = {};

			_.each(this, function (blob) {

				list.push(blob.clone());
				paths[blob.path] = true;
			});

			_.each(fQuery(arg), function (blob) {

				if (!paths[blob.path]) {
					list.push(blob);
				}
			});

			return this.push(list);
		},

		not: function (arg) {

			var list = [],
				paths = {};

			_.each(fQuery(arg), function (blob) {

				paths[blob.path] = true;
			});

			_.each(this, function (blob) {

				if (!paths[blob.path]) {
					list.push(blob.clone());
				}
			});

			return this.push(list);
		},

		each: function (fn) {

			_.each(this, function (blob) {

				fn.call(blob, blob);
			});

			return this;
		},

		edit: function (fn) {

			var list = [];

			_.each(this, function (blob) {

				var clone = blob.clone();
				fn.call(clone, clone);
				list.push(clone);
			});

			this.push(list);

			return this;
		}
	});
};
