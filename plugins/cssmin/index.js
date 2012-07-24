/*jshint node: true */
'use strict';

var fs = require('fs'),
	vm = require('vm'),
	_ = require('underscore'),

	cssmin_content = fs.readFileSync(__dirname + '/cssmin.js', 'utf-8'),
	sandbox = {},
	YAHOO;



vm.runInNewContext(cssmin_content, sandbox, 'cssmin.js');
YAHOO = sandbox.YAHOO;



module.exports = function (fQuery) {

	return  {

		cssmin: function (options) {

			var fquery = this,
				linebreak = -1;

			return this.edit(function (blob) {

				try {
					blob.content = YAHOO.compressor.cssmin(blob.content, linebreak);
				} catch (err) {
					fQuery.error({
						method: 'cssmin',
						message: 'failed',
						fquery: fquery,
						blob: blob,
						data: err
					});
				}
			});
		}
	};
};
