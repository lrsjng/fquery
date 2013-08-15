/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var _ = require('underscore'),
		defaults = {
			cmd: null,
			args: [],
			opts: {},
			onStdout: function (data) { process.stdout.write(data);	},
			onStderr: function (data) { process.stderr.write(data);	},
			done: null,
			fail: null
		};


	fQuery.spawn_process = function (options) {

		var settings = _.extend({}, defaults, options);

		fQuery.info({ method: 'spawn_process', message: settings.cmd + ' ' + settings.args.join(' ') });

		var child_process = require('child_process'),
			proc = child_process.spawn(settings.cmd, settings.args, settings.opts);

		if (_.isFunction(settings.onStdout)) {
			proc.stdout.on('data', settings.onStdout);
		}
		if (_.isFunction(settings.onStderr)) {
			proc.stderr.on('data', settings.onStderr);
		}

		proc.on('exit', function (code) {

			if (code) {
				fQuery.error({ method: settings.cmd, message: 'exit code ' + code });

				if (_.isFunction(settings.fail)) {
					settings.fail(code);
				}
			} else {
				fQuery.ok({ method: settings.cmd, message: 'done' });

				if (_.isFunction(settings.done)) {
					settings.done(code);
				}
			}
		});
	};

};
