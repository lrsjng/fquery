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


	return {

		shzip: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options),
				args;

			if (!_.isString(settings.target)) {
				fQuery.error({
					method: 'shzip',
					message: 'target needs to be a string',
					fquery: fquery
				});
			}

			settings.target = path.resolve(settings.target);
			settings.dir = path.resolve(settings.dir);

			args = ['-o', settings.target];
			this.each(function (blob) {

				args.push(path.relative(settings.dir, blob.source));
			});

			fQuery.spawn_process({
				cmd: 'zip',
				args: args,
				opts: { cwd: settings.dir },
				onStdout: null,
				done: settings.done,
				fail: settings.fail
			});

			return this;
		}
	};
};
