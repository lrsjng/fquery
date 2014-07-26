/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.spawn = function (cmd, options) {

		var child_process = require('child_process'),
			deferred = fQuery.Q.defer(),

			onStdout = function (data) {

				deferred.notify({
					out: data.toString('utf-8'),
					err: false
				});
			},

			onStderr = function (data) {

				deferred.notify({
					out: data.toString('utf-8'),
					err: true
				});
			},

			onExit = function (code) {

				if (code) {
					fQuery.Event.error({ method: cmd.join(' '), message: 'exit code ' + code });
					deferred.reject(code);
				} else {
					fQuery.Event.ok({ method: cmd.join(' '), message: 'done' });
					deferred.resolve(code);
				}
			},

			proc;

		fQuery.Event.info({ method: 'spawn', message: cmd.join(' ') });

		proc = child_process.spawn(cmd[0], cmd.slice(1), options);
		proc.stdout.on('data', onStdout);
		proc.stderr.on('data', onStderr);
		proc.on('exit', onExit);

		return deferred.promise;
	};
};
