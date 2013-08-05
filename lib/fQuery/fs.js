/*jshint node: true */
'use strict';

var fs = require('fs'),
	_ = require('underscore'),
	Blob = require('../Blob');


module.exports = function (fQuery) {

	var OVERWRITE = fQuery.OVERWRITE = {};
	var I_AM_SURE = fQuery.I_AM_SURE = {};


	fQuery.mkdirp = function (dirpath) {

		return Blob.mkdirp(dirpath).isDirectory();
	};

	fQuery.rmfr = function (iamsure, filepath) {

		if (iamsure !== I_AM_SURE) {
			fQuery.error({
				method: 'rmfr',
				message: 'first argument needs to be fQuery.I_AM_SURE',
				data: Array.prototype.slice.call(arguments)
			});
		}

		return Blob.rmfr(filepath);
	};


	var plugin = {

		read: function () {

			return this.each(function (blob) {

				blob.read();
			});
		},

		remove: function (iamsure) {

			if (iamsure !== I_AM_SURE) {
				fQuery.error({
					method: 'remove',
					message: 'first argument needs to be fQuery.I_AM_SURE',
					fquery: this
				});
			}

			return this.each(function (blob) {

				blob.remove();
			});
		}
	};

	_.each('write copy move'.split(' '), function (name) {

		plugin[name.toUpperCase()] = function (arg) {

			this[name](OVERWRITE, arg);
		};

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
						fQuery.error({
							method: name,
							message: 'target file already exists: ' + dest,
							fquery: fquery,
							blob: blob,
							data: dest
						});
					}

					blob[name](dest);
				});
			}

			if (_.isString(arg)) {
				if (this.length > 1) {
					fQuery.error({
						method: name,
						message: 'constant filepath not allowed for more than one selected item',
						fquery: this,
						data: arg
					});
				}

				return this.each(function (blob, idx, fquery) {

					if (!overwrite && fs.existsSync(arg)) {
						fQuery.error({
							method: name,
							message: 'target file already exists: ' + arg,
							fquery: fquery,
							blob: blob,
							data: arg
						});
					}

					blob[name](arg);
				});
			}

			fQuery.error({
				method: name,
				message: 'argument needs to be String or Function',
				fquery: this,
				data: arg
			});
		};
	});

	return plugin;
};
