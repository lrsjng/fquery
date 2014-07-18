/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var path = require('path'),
		_ = require('underscore'),
		defaults = {
			target: null,
			dir: null,
			done: function () {},
			fail: function () {}
		};

	fQuery.fn.shzip = function (options) {

		var settings = _.extend({}, defaults, options),
			args;

		if (!_.isString(settings.target)) {
			fQuery.Event.error({
				method: 'shzip',
				message: 'target needs to be a string',
				fquery: this
			});
		}

		// settings.callback is deprecated. Make it backwards compatible.
		settings.done = settings.callback || settings.done;
		settings.fail = settings.callback || settings.fail;

		settings.target = path.resolve(settings.target);
		settings.dir = path.resolve(settings.dir);

		args = ['-o', settings.target];
		this.each(function (blob) {

			args.push(path.relative(settings.dir, blob.source));
		});

		fQuery.spawnProcess({
			cmd: 'zip',
			args: args,
			opts: { cwd: settings.dir },
			onStdout: null,
			done: settings.done,
			fail: settings.fail
		});

		return this;
	};
};
