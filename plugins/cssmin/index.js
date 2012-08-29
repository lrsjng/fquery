/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	vm = require('vm'),
	_ = require('underscore'),

	cssmin_content = fs.readFileSync(path.resolve(__dirname, 'cssmin.js'), 'utf-8'),
	sandbox = {},
	YAHOO,

	defaults = {
		linebreak: -1
	};



vm.runInNewContext(cssmin_content, sandbox, 'cssmin.js');
YAHOO = sandbox.YAHOO;



module.exports = function (fQuery) {

	return  {

		cssmin: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options);

			return this.edit(function (blob) {

				try {
					blob.content = YAHOO.compressor.cssmin(blob.content, settings.linebreak);
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
