/*jshint node: true, strict: false */

var _ = require('underscore'),

	includify = require('./includify');


module.exports = {

	includify: function (options) {

		return this.edit(function (blob) {

			blob.content = includify({ file: blob.source, content: blob.content });
		});
	}
};
