/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var constant_fn = function (constant) {

			return function () { return constant; };
		},

		syntax_check = function (opname, fquery, arg) {

			if (!fQuery._.isFunction(arg) && !fQuery._.isString(arg)) {
				fQuery.Event.error({
					method: opname,
					message: 'argument needs to be String or Function',
					fquery: fquery,
					data: arg
				});
			}

			if (fQuery._.isString(arg) && fquery.length > 1) {
				fQuery.Event.error({
					method: opname,
					message: 'constant filepath not allowed for more than one selected item',
					fquery: fquery,
					data: arg
				});
			}
		},

		overwrite_check = function (overwrite, opname, fquery, blob, dest) {

			var fs = require('fs');

			if (!overwrite && fs.existsSync(dest)) {
				fQuery.Event.error({
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

			if (fQuery._.isString(arg)) {
				arg = constant_fn(arg);
			}

			fquery.each(function (blob, idx) {

				var dest = arg.call(fquery, blob, idx);
				overwrite_check(overwrite, opname, fquery, blob, dest);
				blob[opname](dest);
			});
		};


	fQuery.fn.write = function (arg, overwrite) {

		operation('write', this, arg, overwrite);
		return this;
	};

	fQuery.fn.thenWrite = function (arg, overwrite) {

		return this.then(function () {

			return this.write(arg, overwrite);
		});
	};

	fQuery.fn.move = function (arg, overwrite) {

		operation('move', this, arg, overwrite);
		return this;
	};

	fQuery.fn.thenMove = function (arg, overwrite) {

		return this.then(function () {

			return this.move(arg, overwrite);
		});
	};
};
