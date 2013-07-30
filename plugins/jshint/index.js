/*jshint node: true */
'use strict';

var _ = require('underscore'),
	jshint = require('jshint').JSHINT,

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


module.exports = function (fQuery) {

	return {

		jshint: function (options, globals) {

			var fquery = this;

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
