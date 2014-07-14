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


	fQuery.fn.push_instant = function (blobs) {

		blobs = _.isArray(blobs) ? blobs : [blobs];
		blobs = blobs.filter(function (blob) { return blob instanceof fQuery.Blob; });

		if (!this._stack) {
			this._stack = [];
		}

		this._stack.unshift(blobs);
		publish(this, this._stack[0]);
	};


	fQuery.fn.pop_instant = function () {

		if (!this._stack) {
			this._stack = [];
		}

		var popped = this._stack.shift();
		publish(this, this._stack[0]);
		return popped;
	};


	fQuery.fn.get = function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return idx < 0 ? this[this.length + idx] : this[idx];
	};


	fQuery.fn.push = function (blobs) {

		return this.then(function () {

			this.push_instant(blobs);
		});
	};


	fQuery.fn.pop = function () {

		return this.then(function () {

			this.pop_instant();
		});
	};
};
