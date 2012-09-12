/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn,
	_ = require('underscore'),
	moment = require('moment'),

	defaults = {
		target: null,
		dir: null,
		callback: function () {}
	};

module.exports = function (fQuery) {

	return  {

		shzip: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			if (!_.isString(settings.target)) {
				fQuery.error({
					method: 'shzip',
					message: 'target needs to be a string',
					fquery: fquery
				});
			}
			if (!_.isFunction(settings.callback)) {
				fQuery.error({
					method: 'shzip',
					message: 'callback needs to be a function',
					fquery: fquery
				});
			}

			settings.target = path.resolve(settings.target);
			settings.dir = path.resolve(settings.dir);

			var cmd = 'zip',
				args = ['-o', settings.target],
				opts = { cwd: settings.dir };

			fQuery.info({
				method: 'shzip',
				message: cmd + ' ' + args.join(' '),
				fquery: fquery
			});

			this.each(function (blob) {

				args.push(path.relative(settings.dir, blob.source));
			});

			var proc = spawn(cmd, args, opts);

			proc.stderr.on('data', function (data) {
				process.stderr.write(data);
			});
			proc.on('exit', function (code) {
				if (code) {
					fQuery.error({
						method: 'shzip',
						message: 'exit code ' + code,
						fquery: fquery,
						data: code
					});
				} else {
					fQuery.ok({
						method: 'shzip',
						message: 'created zipball ' + settings.target,
						fquery: fquery,
						data: settings.target
					});
				}
				settings.callback(code);
			});
			return this;
		}
	};
};
