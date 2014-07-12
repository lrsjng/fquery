/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var _ = require('underscore'),
		q = require('q'),
		child_process = require('child_process'),
		defaults = {
			cmd: null,
			args: [],
			opts: {}
		};


	fQuery.spawn = function (options) {

		var settings = _.extend({}, defaults, options),
			deferred = q(),
			proc;

		fQuery.info({ method: 'spawn', message: settings.cmd + ' ' + settings.args.join(' ') });

		proc = child_process.spawn(settings.cmd, settings.args, settings.opts);

		proc.stdout.on('data', deferred.notify);
		proc.stderr.on('data', deferred.notify);

		proc.on('exit', function (code) {

			if (code) {
				fQuery.error({ method: settings.cmd, message: 'exit code ' + code });
				deferred.reject(code);
			} else {
				fQuery.ok({ method: settings.cmd, message: 'done' });
				deferred.resolve(code);
			}
		});

		return deferred.promise;
	};
};
