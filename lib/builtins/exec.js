/*jshint node: true */
'use strict';


var child_process = require('child_process'),
	q = require('q');


module.exports = function (fQuery) {

	fQuery.exec = function (cmd, options) {

		var deferred = q.defer();

		child_process.exec(cmd.join(' '), options, function (err, stdout, stderr) {

			if (err) {
				deferred.reject(stderr);
			} else {
				deferred.resolve(stdout);
			}
		});

		return deferred.promise;
	};

	fQuery.spawn = function (cmd, options) {

		var deferred = q.defer(),

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
