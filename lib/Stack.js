/*jshint node: true, strict: false */

var _ = require('underscore');



var Stack = module.exports = function (blobs) {

	this._stack = [];
	this._push(blobs);
};

_.extend(Stack.prototype, {

	_publishTop: function () {

		var top = this._stack[this._stack.length - 1],
			i, l;

		for (i = 0, l = top.length; i < l; i += 1) {
			this[i] = top[i];
		}
		for (i = top.length; this[i] !== undefined; i += 1) {
			delete this[i];
		}

		this.length = top.length;
	},

	_push: function (blobs) {

		blobs = blobs || [];
		if (!_.isArray(blobs)) {
			blobs = [blobs];
		}

		this._stack.push(blobs);
		this._publishTop();
	},

	_pop: function () {

		if (this._stack.length) {
			this._stack.pop();
		}
		if (!this._stack.length) {
			this._stack.push([]);
		}
		this._publishTop();
	}
});
