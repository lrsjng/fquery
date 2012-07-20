/*jshint node: true, strict: false */

var _ = require('underscore'),

	less = require('./less-sync');


module.exports = function (fQuery) {

	fQuery.fn.less = function (options) {

		return this.edit(function () {

			this.content = less(this.path, this.content, false);
		});
	};
};
