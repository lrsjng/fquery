/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	fQuery.fn.log_instant = function (lines, len) {

		process.stdout.write(this.toString(lines, len));
	};


	fQuery.fn.log = function (lines, len) {

		return this.then(function () {

			this.log_instant(lines, len);
		});
	};
};
