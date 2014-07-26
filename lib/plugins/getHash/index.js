/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var defaults = {
			algorithm: 'sha1',  // 'sha1', 'md5', 'sha256', 'sha512'
			encoding: 'hex'     // 'hex', 'binary', 'base64'
		};

	fQuery.getHash = function (sequence, options) {

		var _ = require('underscore'),
			crypto = require('crypto'),

			settings = _.extend({}, defaults, options),

			shasum = crypto.createHash(settings.algorithm);

		shasum.update(sequence);
		return shasum.digest(settings.encoding);
	};

	fQuery.fn.getHash = function (options) {

		return fQuery.getHash(this.getContent(), options);
	};
};
