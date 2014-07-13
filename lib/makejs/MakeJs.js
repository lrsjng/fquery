/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	_ = require('underscore'),
	moment = require('moment'),

	fQuery = require('../fquery/fQuery'),
	Event = require('../fquery/Event'),
	color = require('../fquery/format/color'),
	Target = require('./Target'),

	noop = function () {},

	chain = function (targets, names, stack) {

		var result = [];

		_.each(names, function (name) {

			if (_.indexOf(stack, name) >= 0) {
				fQuery.error({
					method: 'circular dependencies',
					message: stack.join(', ') + ' -> ' + name
				});
			}

			stack.push(name);

			if (targets[name]) {
				_.each(targets[name].deps, function (dep) {
					result = result.concat(chain(targets, [dep], stack));
				});
			} else {
				fQuery.error({
					method: 'target not found',
					message: name
				});
			}

			stack.pop();

			result.push(name);
		});

		return _.uniq(result);
	};


var MakeJs = module.exports = function (filepath) {

	this._defaults = [];
	this._targets = {};

	this._before = function (time) {

	};

	this._beforeTarget = function (target, time) {

		console.log(color('cyanL', '\n[' + target.name + ']'));
	};

	this._afterTarget = function (target, time) {

	};

	this._onSuccess = function (time) {

		console.log(color('greenL', '\n[successful in ' + (time / 1000) + ' seconds]'));
	};

	this._onError = function (time) {

		console.log(color('redL', '\n[failed in ' + (time / 1000) + ' seconds]'));
	};

	if (_.isString(filepath)) {
		this.load(filepath);
	}
};


_.each('before beforeTarget afterTarget onSuccess onError'.split(' '), function (name) {

	MakeJs.prototype[name] = function (fn) {

		this['_' + name] = _.isFunction(fn) ? fn : noop;
	};
});


_.extend(MakeJs.prototype, {

	// publish some helpers
	Event: Event,
	fQuery: fQuery,
	moment: moment,

	load: function (filepath) {

		filepath = path.resolve(filepath);

		try {
			if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
				throw 'file not found: "' + filepath + '"';
			}

			var fn = require(filepath);

			if (!_.isFunction(fn)) {
				throw 'module.exports needs to be a function: "' + filepath + '"';
			}

			fn(this);
		} catch (err) {
			if (err instanceof Event) {
				throw err;
			} else {
				fQuery.error({
					method: 'makefile',
					message: err.toString()
				});
			}
		}

		return this;
	},

	version: function (arg) {

		if (!fQuery.version(arg)) {

			fQuery.error({
				method: 'version',
				message: 'fQuery version (' + fQuery.version() + ') does not satisfy requirements: ' + arg
			});
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

	process: function (names) {

		if (!_.isArray(names)) {
			names = Array.prototype.slice.call(arguments);
		}
		if (!names.length) {
			names = this._defaults;
		}

		var self = this,
			processing = null,
			startTime = null,

			time = function () {

				return new Date().getTime() - startTime.getTime();
			},

			tasks = _.flatten(_.map(chain(this._targets, names, []), function (name) {

				var target = self._targets[name],
					tasks = target._tasks.slice();

				tasks.unshift(function (done) {

					self._beforeTarget(target, time());
					done();
				});
				tasks.push(function (done) {

					self._afterTarget(target, time());
					done();
				});

				return tasks;
			})),

			error = function () {

				processing = null;
				self._onError(time());
			},

			next = function () {

				processing += 1;

				if (processing < tasks.length) {

					var task = tasks[processing];

					process.nextTick(function () {

						task(next, error);
					});
				} else {
					processing = null;
					self._onSuccess(time());
				}
			},

			start = function () {

				if (processing === null) {
					startTime = new Date();
					processing = -1;
					self._before(time());
					next();
				}
			};

		start();
	}
});
