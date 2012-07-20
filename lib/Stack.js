/*jshint node: true, strict: false */

var _ = require('underscore');



var Stack = module.exports = function (blobs) {

	this._stack = [];
	this._push(blobs);
};

_.extend(Stack.prototype, {

	_updateCurrent: function () {

		var current = this._stack[this._stack.length - 1],
			i, l;

		for (i = 0, l = current.length; i < l; i += 1) {
			this[i] = current[i];
		}
		for (i = current.length; this[i] !== undefined; i += 1) {
			delete this[i];
		}

		this.length = current.length;
	},

	_push: function (blobs) {

		blobs = blobs || [];
		if (!_.isArray(blobs)) {
			blobs = [blobs];
		}

		this._stack.push(blobs);
		this._updateCurrent();
	},

	_pop: function () {

		if (this._stack.length) {
			this._stack.pop();
		}
		if (!this._stack.length) {
			this._stack.push([]);
		}
		this._updateCurrent();
	}
});
