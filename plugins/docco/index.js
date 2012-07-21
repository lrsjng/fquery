/*jshint node: true, strict: false */

var path = require('path'),
	_ = require('underscore'),
	docco = require('./docco');


module.exports = {

	docco: function (dest, callback) {

		docco({
			dest: dest,
			files: _.pluck(this, 'source'),
			callback: function () {

				if (_.isFunction(callback)) {
					callback();
				}
			}
		});

		return this;
	}
};
