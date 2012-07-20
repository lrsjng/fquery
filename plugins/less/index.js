/*jshint node: true, strict: false */

var _ = require('underscore'),

	less = require('./less-sync');


module.exports = {

	less: function (options) {

		return this.edit(function () {

			this.content = less(this.source, this.content, false);
		});
	}
};
