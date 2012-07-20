/*jshint node: true, strict: false */

var _ = require('underscore'),

	includify = require('./includify');


module.exports = {

	includify: function (options) {

		return this.edit(function () {

			this.content = includify({ file: this.source, content: this.content });
		});
	}
};
