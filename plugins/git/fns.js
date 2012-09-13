/*jshint node: true */
'use strict';

var exec = require('child_process').exec,
	_ = require('underscore'),
	async = require('async'),

	fns = {

		revListMasterHead: function (dir, options, callback) {

			var cmd = 'git rev-list master..HEAD',
				opts = { cwd: dir };

			exec(cmd, opts, function (err, stdout, stderr) {

				var result = err ? [] : _.compact(stdout.split(/\r?\n/));

				callback(err, result);
			});
		},

		revParseHead: function (dir, options, callback) {

			var cmd = 'git rev-parse HEAD',
				opts = { cwd: dir };

			exec(cmd, opts, function (err, stdout, stderr) {

				var result = stdout.replace(/\s*/g, '');

				callback(err, result);
			});
		}
	};


module.exports = function (dir, options, callback) {

	var run = {};

	_.each(fns, function (fn, id) {

		run[id] = function (callback) {

			fns[id](dir, options, callback);
		};
	});

	async.parallel(run, callback);
};
