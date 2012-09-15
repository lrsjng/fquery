/*jshint node: true */
'use strict';

var exec = require('child_process').exec,
	_ = require('underscore'),
	async = require('async'),

	revList = function (dir, query, callback) {

		var cmd = 'git rev-list ' + query,
			opts = { cwd: dir };

		exec(cmd, opts, function (err, stdout, stderr) {

			var result = err ? [] : _.compact(stdout.split(/\r?\n/));

			callback(null, result);
		});
	},

	revParse = function (dir, query, callback) {

		var cmd = 'git rev-parse ' + query,
			opts = { cwd: dir };

		exec(cmd, opts, function (err, stdout, stderr) {

			var result = err ? 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : stdout.replace(/\s*/g, '');

			callback(null, result);
		});
	},

	fns = {
		revParseHead: function (dir, options, callback) {

			revParse(dir, 'HEAD', callback);
		},

		revListMasterHead: function (dir, options, callback) {

			revList(dir, 'master..HEAD', callback);
		},

		revListOriginMasterHead: function (dir, options, callback) {

			revList(dir, 'origin/master..HEAD', callback);
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
