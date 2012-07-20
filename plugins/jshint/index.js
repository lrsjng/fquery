/*jshint node: true, strict: false */

var _ = require('underscore'),
	jshint = require('jshint').JSHINT;


module.exports = {

	jshint: function (options) {

		return this.each(function () {

			console.log('JsHint', this.path);

			var passed = jshint(this.content, options);

			if (!passed) {
				_.each(jshint.errors, function (err) {

					if (err) {
						console.log('  ' + err.line + ':' + err.character + '   ' + err.reason);
					}
				});
			}
		});
	}
};
