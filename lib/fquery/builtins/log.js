/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.log = function (lines, len) {

		return this.then(function () {

			process.stdout.write(this.toString(lines, len));
		});
	};
};
