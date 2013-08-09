/*jshint node: true */
'use strict';

var _ = require('underscore');


var Target = module.exports = function (name, deps, desc) {

	this.name = name;
	this.deps = deps || [];
	this.desc = desc || '';

	this._tasks = [];
};


_.extend(Target.prototype, {

	async: function (fn) {

		if (_.isFunction(fn)) {
			this._tasks.push(fn);
		}

		return this;
	},

	sync: function (fn) {

		if (_.isFunction(fn)) {
			this._tasks.push(function (done, failed) {

				var result = fn();
				if (result === false) {
					failed();
				} else {
					done();
				}
			});
		}

		return this;
	}
});
