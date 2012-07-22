/*jshint node: true, strict: false */

var _ = require('underscore'),
	jshint = require('jshint').JSHINT;


module.exports = function (fQuery) {

	return {

		jshint: function (options) {

			var self = this;

			return this.each(function () {

				if (!jshint(this.content, options)) {
					self.error('jshint', jshint.errors[0].reason, this, jshint.errors);
				}
			});
		}
	};
};
