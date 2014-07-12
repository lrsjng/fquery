/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.content = function (sep) {

		sep = sep || '\n';

		var content = '';

		this.each_instant(function (blob) {

			content += (content ? sep : '') + blob.content;
		});

		return content;
	};
};
