/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	fQuery.spawn_process = function (cmd, args, opts, done, fail) {

		args = args || [];
		opts = opts || {};

		fQuery.info({ method: 'spawn_process', message: cmd + ' ' + args.join(' ') });

		var child_process = require('child_process'),
			proc = child_process.spawn(cmd, args, opts);

		proc.stdout.on('data', function (data) {

			process.stdout.write(data);
		});

		proc.stderr.on('data', function (data) {

			process.stderr.write(data);
		});

		proc.on('exit', function (code) {

			if (code) {
				fQuery.error({ method: cmd, message: 'exit code ' + code });
				fail();
			} else {
				fQuery.ok({ method: cmd, message: 'done' });
				done();
			}
		});
	};

};
