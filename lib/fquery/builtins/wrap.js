/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.wrap = function (prepend, append) {

		prepend = prepend || '';
		append = append || '';

		return this.edit(function (blob) {

			blob.content = prepend + blob.content + append;
		});
	};
};
