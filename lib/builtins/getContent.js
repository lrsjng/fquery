/*jshint node: true */
'use strict';


var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.getContent = function (sep) {

		return this.map(function (blob) {

			return _.isString(blob.content) ? blob.content : '';
		}).join(sep || '');
	};
};
