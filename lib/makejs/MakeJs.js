/*jshint node: true */
'use strict';

var path = require('path'),
	util = require('util'),
	_ = require('underscore'),

	fQuery = require('../fQuery'),
	color = require('../format/color'),
	Target = require('./Target'),

	chain = function (targets, names, stack) {

		var result = [];

		_.each(names, function (name) {

			if (_.indexOf(stack, name) >= 0) {
				fQuery.error({ method: 'circular dependencies', message: stack.join(', ') + ' -> ' + name });
			}

			stack.push(name);

			if (targets[name]) {
				_.each(targets[name].deps, function (dep) {
					result = result.concat(chain(targets, [dep], stack));
				});
			} else {
				fQuery.error({ method: 'target not found', message: name });
			}

			stack.pop();

			result.push(name);
		});

		return _.uniq(result);
	};


var MakeJs = module.exports = function (filepath) {

	this._defaults = [];
	this._targets = {};

	if (filepath) {
		this.load(filepath);
	}
};

_.extend(MakeJs.prototype, {

	load: function (filepath) {

		var fn;

		filepath = path.resolve(filepath);

		try {
			fn = require(filepath);
		} catch (err) {
			fQuery.error({ method: 'import', message: 'file not found: ' + filepath });
		}

		if (_.isFunction(fn)) {
			fn(this, fQuery);
		}

		return this;
	},

	defaults: function (names) {

		if (!_.isArray(names)) {
			names = Array.prototype.slice.call(arguments);
		}

		this._defaults = names.slice();

		return this;
	},

	target: function (name, deps, desc) {

		var target = new Target(name, deps, desc);
		this._targets[name] = target;
		return target;
	},

	before: function (time) {

	},

	beforeTarget: function (target, time) {

		console.log(color('cyanL', '\n[' + target.name + ']'));
	},

	afterTarget: function (target, time) {

	},

	onSuccess: function (time) {

		console.log(color('greenL', '\n[OK, ' + time + ' seconds]'));
	},

	onFail: function (time) {

		console.log(color('redL', '\n[FAILED, ' + time + ' seconds]'));
	},



	chain: function (names) {

		if (!_.isArray(names)) {
			names = Array.prototype.slice.call(arguments);
		}

		return chain(this._targets, names, []);
	},

	process: function (names) {

		var self = this;

		var processing = null,

			startTime = null,
			time = function () {

				return (new Date().getTime() - startTime.getTime()) / 1000.0;
			},

			before = function () {

				if (_.isFunction(self.before)) {
					self.before(time());
				}
			},
			beforeTarget = function (target) {

				if (_.isFunction(self.beforeTarget)) {
					self.beforeTarget(target, time());
				}
			},
			afterTarget = function (target) {

				if (_.isFunction(self.afterTarget)) {
					self.afterTarget(target, time());
				}
			},
			success = function () {

				processing = null;
				if (_.isFunction(self.onSuccess)) {
					self.onSuccess(time());
				}
			},
			fail = function () {

				processing = null;
				if (_.isFunction(self.onFail)) {
					self.onFail(time());
				}
			};

		if (!names || !names.length) {
			names = self._defaults;
		}

		var tasks = _.flatten(_.map(self.chain(names), function (name) {

			var target = self._targets[name];

			if (!target) {
				return [];
			}

			var tasks = target._tasks.slice(0);
			tasks.unshift(function (done) { beforeTarget(target); done(); });
			tasks.push(function (done) { afterTarget(target); done(); });
			return tasks;
		}));

		var next = function () {

				processing += 1;

				if (processing < tasks.length) {

					var fn = tasks[processing];

					process.nextTick(function () {

						fn(next, fail);
					});
				} else {
					success();
				}
			},

			start = function () {

				if (processing === null) {
					startTime = new Date();
					processing = -1;
					before();
					next();
				}
			};

		start();
	}
});
