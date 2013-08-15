/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var _ = require('underscore'),

		toGlobals = function () {

			var globals = {};

			_.each(arguments, function (arg) {

				if (_.isArray(arg)) {
					_.each(arg, function (glob) {
						globals[glob] = true;
					});
				} else {
					globals = _.extend({}, globals, arg);
				}
			});

			return globals;
		};


	return {

		jshint: function (options, globals) {

			var fquery = this,
				jshint = require('jshint').JSHINT;

			globals = toGlobals(globals, options.predef);

			return this.each(function (blob) {

				if (!jshint(blob.content, options, globals)) {
					fQuery.error(_.map(_.compact(jshint.errors), function (err) {

						return {
							method: 'jshint',
							message: (err.id ? err.id + ' ' : '') + err.reason,
							fquery: fquery,
							blob: blob,
							line: err.line,
							column: err.character,
							data: err
						};
					}));
				}
			});
		}
	};
};
