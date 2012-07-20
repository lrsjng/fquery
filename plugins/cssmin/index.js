/*jshint node: true, strict: false */

var _ = require('underscore'),
	cssmin = require('./cssmin');


module.exports = {

	cssmin: function (options) {

		var linebreak = -1;

		return this.edit(function () {

			this.content = cssmin(this.content, linebreak);
		});
	}
};
