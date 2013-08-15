/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var path = require('path'),
		_ = require('underscore'),

		defaults = {
			target: null,
			dir: null,
			callback: function () {}
		};


	return  {

		shzip: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			if (!_.isString(settings.target)) {
				fQuery.error({
					method: 'shzip',
					message: 'target needs to be a string',
					fquery: fquery
				});
			}
			if (!_.isFunction(settings.callback)) {
				fQuery.error({
					method: 'shzip',
					message: 'callback needs to be a function',
					fquery: fquery
				});
			}

			settings.target = path.resolve(settings.target);
			settings.dir = path.resolve(settings.dir);

			var cmd = 'zip',
				args = ['-o', settings.target],
				opts = { cwd: settings.dir };

			this.each(function (blob) {

				args.push(path.relative(settings.dir, blob.source));
			});

			fQuery.spawn_process(cmd, args, opts, settings.callback, settings.callback);

			return this;
		}
	};
};
