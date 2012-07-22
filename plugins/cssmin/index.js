/*jshint node: true, strict: false */

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

			var linebreak = -1;

			return this.edit(function () {

				try {
					this.content = YAHOO.compressor.cssmin(this.content, linebreak);
				} catch (err) {
					fQuery.error('cssmin', err, this);
				}
			});
		}
	};
};
