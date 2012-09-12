/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	_ = require('underscore'),
	moment = require('moment'),

	defaults = {
		short: true
	};

module.exports = function (fQuery) {

	fQuery.githash = function (dir, options, callback) {

		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}
		if (!_.isString(dir)) {
			fQuery.error({
				method: 'githash',
				message: 'dir needs to be a string'
			});
		}
		if (!_.isFunction(callback)) {
			fQuery.error({
				method: 'githash',
				message: 'callback needs to be a function'
			});
		}

		var settings = _.extend({}, defaults, options);


		var cmd = settings.short ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD',
			opts = { cwd: dir };

		fQuery.info({ method: 'githash', message: cmd });

		exec(cmd, opts, function (err, stdout, stderr) {

			if (err) {
				fQuery.error({
					method: 'githash',
					message: err,
					data: err
				});
			}

			var hash = stdout.replace(/\s*/g, '');

			fQuery.ok({
				method: 'githash',
				message: hash,
				data: hash
			});

			callback(err, hash);
		});
	};
};
