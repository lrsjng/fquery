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

	fQuery.fn.jshint = function (options, globals) {

		var jshint = require('jshint').JSHINT;

		globals = toGlobals(globals, options.predef);

		return this.each(function (blob) {

			if (!jshint(blob.content, options, globals)) {
				fQuery.Event.error(_.map(_.compact(jshint.errors), function (err) {

					return {
						method: 'jshint',
						message: (err.id ? err.id + ' ' : '') + err.reason,
						fquery: this,
						blob: blob,
						line: err.line,
						column: err.character,
						data: err
					};
				}));
			}
		});
	};

	fQuery.fn.thenJshint = function (options, globals) {

		return this.then(function () {

			return this.jshint(options, globals);
		});
	};
};
