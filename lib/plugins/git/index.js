/*jshint node: true */
'use strict';


var _ = require('underscore'),
	q = require('q');


module.exports = function (fQuery) {

	var revList = function (dir, query) {

			return fQuery.exec(['git', 'rev-list', query], {cwd: dir})
				.then(function (stdout) {

					return _.compact(stdout.split(/\r?\n/));
				})
				.fail(function () {

					return [];
				});
		},

		revParse = function (dir, query, callback) {

			return fQuery.exec(['git', 'rev-parse', query], {cwd: dir})
				.then(function (stdout) {

					return stdout.replace(/\s*/g, '');
				})
				.fail(function () {

					return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
				});
		};


	fQuery.git = function (dir) {

		fQuery.Event.info({
			method: 'git',
			message: 'fetching repository data'
		});

		var promises = [
				revParse(dir, 'HEAD'),
				revList(dir, 'master..HEAD'),
				revList(dir, 'origin/master..HEAD')
			];

		return q.all(promises).spread(function (head, masterToHead, originToHead) {

			var result = {
					head: head,
					buildSuffix: (masterToHead.length || originToHead.length) + '~' + head.slice(0, 7)
				};

			fQuery.Event.ok({
				method: 'git',
				message: 'done'
			});

			return result;
		});
	};
};
