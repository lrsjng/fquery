/*jshint node: true, strict: false */

var _ = require('underscore'),
	jshint = require('jshint').JSHINT;


module.exports = function (fQuery) {

	return {

		jshint: function (options) {

			return this.each(function () {

				if (!jshint(this.content, options)) {
					fQuery.error('jshint', jshint.errors, this);
				}
			});
		}
	};
};
