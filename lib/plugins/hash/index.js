/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	var defaults = {
			algorithm: 'sha1',  // 'sha1', 'md5', 'sha256', 'sha512'
			encoding: 'hex'     // 'hex', 'binary', 'base64'
		},

		hash = function (sequence, options) {

			var _ = require('underscore'),
				crypto = require('crypto'),

				settings = _.extend({}, defaults, options),

				shasum = crypto.createHash(settings.algorithm);

			shasum.update(sequence);
			return shasum.digest(settings.encoding);
		};


	fQuery.hash = hash;


	return {

		hash: function (options) {

			return hash(this.content(), options);
		}
	};
};
