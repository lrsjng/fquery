/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore');


module.exports = function (fQuery) {

	return {

		docco: function (dest, callback) {

			fQuery.info({
				method: 'docco',
				message: 'not available yet',
				fquery: this
			});

			return this;
		}
	};
};
