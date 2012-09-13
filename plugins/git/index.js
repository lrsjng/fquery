/*jshint node: true */
'use strict';

var _ = require('underscore'),

	fns = require('./fns'),

	defaults = {
	};

module.exports = function (fQuery) {

	fQuery.git = function (dir, options, callback) {

		if (_.isFunction(options)) {
			callback = options;
			options = null;
		}
		if (!_.isString(dir)) {
			fQuery.error({
				method: 'git',
				message: 'dir needs to be a string'
			});
		}
		if (!_.isFunction(callback)) {
			fQuery.error({
				method: 'git',
				message: 'callback needs to be a function'
			});
		}

		var settings = _.extend({}, defaults, options);

		fQuery.info({
			method: 'git',
			message: 'fetching repository data'
		});

		fns(dir, options, function (err, result) {

			if (err) {
				fQuery.error({
					method: 'git',
					message: err,
					data: err
				});
			}

			fQuery.ok({
				method: 'git',
				message: 'done'
			});

			callback(err, result);
		});
	};
};
