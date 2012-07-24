/*jshint node: true */
'use strict';

var _ = require('underscore');


module.exports = function (fQuery) {

	var plugin = {};

	_.each('read remove'.split(' '), function (name) {

		plugin[name] = function () {

			return this.each(function (blob) {

				blob[name]();
			});
		};
	});

	_.each('write copy move'.split(' '), function (name) {

		plugin[name] = function (arg) {

			if (_.isFunction(arg)) {

				return this.each(function (blob, idx) {

					blob[name](arg.call(blob, blob, idx));
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({ method: name, message: 'constant filepath not allowed for more than one selected item', fquery: this, data: arg });
				}

				return this.each(function (blob) {

					blob[name](arg);
				});
			}

			fQuery.error({ method: name, message: 'argument needs to be String or Function', fquery: this, data: arg });
		};
	});

	return plugin;
};
