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

		revParse = function (dir, query) {

			return fQuery.exec(['git', 'rev-parse', query], {cwd: dir})
				.then(function (stdout) {

					return stdout.trim();
				})
				.fail(function () {

					return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
				});
		},

		revBranch = function (dir, query) {

			return fQuery.exec(['git', 'rev-parse', '--abbrev-ref', query || 'HEAD'], {cwd: dir})
				.then(function (stdout) {

					return stdout.trim();
				})
				.fail(function () {

					return 'N/A';
				});
		};


	fQuery.git = function (dir) {

		fQuery.Event.info({
			method: 'git',
			message: 'fetching repository data'
		});

		var promises = [
				revParse(dir, 'HEAD'),
				revBranch(dir),
				revList(dir, 'master..HEAD'),
				revList(dir, 'origin/master..HEAD')
			];

		return q.all(promises).spread(function (head, branch, masterToHead, originToHead) {

			var result = {
					head: head,
					branch: branch,
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
