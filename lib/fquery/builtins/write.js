/*jshint node: true */
'use strict';


var fs = require('fs'),
	_ = require('underscore');


module.exports = function (fQuery) {


	var constant_fn = function (constant) {

			return function () { return constant; };
		},
		syntax_check = function (opname, fquery, arg) {

			if (!_.isFunction(arg) && !_.isString(arg)) {
				fQuery.error({
					method: opname,
					message: 'argument needs to be String or Function',
					fquery: fquery,
					data: arg
				});
			}

			if (_.isString(arg) && fquery.length > 1) {
				fQuery.error({
					method: opname,
					message: 'constant filepath not allowed for more than one selected item',
					fquery: fquery,
					data: arg
				});
			}
		},
		overwrite_check = function (overwrite, opname, fquery, blob, dest) {

			if (!overwrite && fs.existsSync(dest)) {
				fQuery.error({
					method: opname,
					message: 'target file already exists: ' + dest,
					fquery: fquery,
					blob: blob,
					data: dest
				});
			}
		},
		operation = function (opname, fquery, arg, overwrite) {

			syntax_check(opname, fquery, arg);

			if (_.isString(arg)) {
				arg = constant_fn(arg);
			}

			fquery.each_instant(function (blob, idx) {

				var dest = arg.call(fquery, blob, idx);
				overwrite_check(overwrite, opname, fquery, blob, dest);
				blob[opname](dest);
			});
		};


	fQuery.fn.write = function (arg, overwrite) {

		return this.then(function () {

			operation('write', this, arg, overwrite);
		});
	};


	fQuery.fn.move = function (arg, overwrite) {

		return this.then(function () {

			operation('move', this, arg, overwrite);
		});
	};


	fQuery.fn.WRITE = function (arg) {

		return this.write(arg, true);
	};


	fQuery.fn.MOVE = function (arg) {

		return this.move(arg, true);
	};
};
