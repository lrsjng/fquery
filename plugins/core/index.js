/*jshint node: true, strict: false */

var _ = require('underscore'),

	Blob = require('../../lib/Blob'),
	findPaths = require('../../lib/Selector');


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

			_.each(findPaths(arg), function (filepath) {

				if (!paths[filepath]) {
					list.push(Blob.select(filepath));
				}
			});

			return this.push(list);
		},

		not: function (arg) {

			var list = [],
				paths = {};

			_.each(findPaths(arg), function (filepath) {

				paths[filepath] = true;
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

		editContent: function (fn) {

			var list = [];

			_.each(this, function (blob) {

				var newContent = fn.call(blob, blob);
				list.push(Blob.create(blob.path, newContent));
			});

			this.push(list);

			return this;
		}
	});
};
