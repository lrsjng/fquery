/*jshint node: true */
'use strict';


var _ = require('underscore'),

	publish = function (obj, array) {

		array = array || [];

		var ol = obj.length,
			al = array.length,
			i;

		for (i = 0; i < al; i += 1) {
			obj[i] = array[i];
		}
		for (i = al; i < ol || obj[i] !== undefined; i += 1) {
			delete obj[i];
		}

		obj.length = al;
	};


module.exports = function (fQuery) {

	fQuery.fn.push = function (blobs) {

		if (blobs instanceof fQuery) {
			blobs = Array.prototype.slice.call(blobs);
		}
		if (!_.isArray(blobs)) {
			blobs = [blobs];
		}

		blobs = blobs.filter(function (blob) { return blob instanceof fQuery.Blob; });

		if (!this._stack) {
			this._stack = [];
		}

		this._stack.unshift(blobs);
		publish(this, this._stack[0]);
	};

	fQuery.fn.pop = function () {

		if (!this._stack) {
			this._stack = [];
		}

		this._stack.shift();

		if (!this._stack.length) {
			this._stack.push([]);
		}

		publish(this, this._stack[0]);
	};

	fQuery.fn.get = function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return idx < 0 ? this[this.length + idx] : this[idx];
	};

	fQuery.fn.thenPush = function (blobs) {

		return this.then(function () {

			this.push(blobs);
		});
	};

	fQuery.fn.thenPop = function () {

		return this.then(function () {

			this.pop();
		});
	};
};
