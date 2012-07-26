/*jshint node: true */
'use strict';

var fs = require('fs'),
	_ = require('underscore');


module.exports = function (fQuery) {

	var OVERWRITE = fQuery.OVERWRITE = {};

	var plugin = {};

	_.each('read remove'.split(' '), function (name) {

		plugin[name] = function () {

			return this.each(function (blob) {

				blob[name]();
			});
		};
	});

	_.each('write copy move'.split(' '), function (name) {

		plugin[name] = function (overwrite, arg) {

			if (overwrite === OVERWRITE) {
				overwrite = true;
			} else {
				arg = overwrite;
				overwrite = false;
			}

			if (_.isFunction(arg)) {

				return this.each(function (blob, idx, fquery) {

					var dest = arg.call(blob, blob, idx, fquery);

					if (!overwrite && fs.existsSync(dest)) {
						fQuery.error({ method: name, message: 'target file already exists: ' + dest, fquery: fquery, blob: blob, data: dest});
					}

					blob[name](dest);
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({ method: name, message: 'constant filepath not allowed for more than one selected item', fquery: this, data: arg });
				}

				return this.each(function (blob, idx, fquery) {

					if (!overwrite && fs.existsSync(arg)) {
						fQuery.error({ method: name, message: 'target file already exists: ' + arg, fquery: fquery, blob: blob, data: arg});
					}

					blob[name](arg);
				});
			}

			fQuery.error({ method: name, message: 'argument needs to be String or Function', fquery: this, data: arg });
		};
	});

	return plugin;
};
