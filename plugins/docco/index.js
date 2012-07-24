/*jshint node: true */
'use strict';

var path = require('path'),
	_ = require('underscore'),
	docco = require('./docco');


module.exports = function (fQuery) {

	return {

		docco: function (dest, callback) {

			// docco({
			// 	dest: dest,
			// 	files: _.pluck(this, 'source'),
			// 	callback: function () {

			// 		if (_.isFunction(callback)) {
			// 			callback();
			// 		}
			// 	}
			// });

			fQuery.info({
				method: 'docco',
				message: 'not available yet',
				fquery: this
			});

			return this;
		}
	};
};
