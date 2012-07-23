/*jshint node: true, strict: false */

var _ = require('underscore'),
	jshint = require('jshint').JSHINT;


module.exports = function (fQuery) {

	return {

		jshint: function (options) {

			var self = this;

			return this.each(function () {

				if (!jshint(this.content, options)) {
					var blob = this,
						errors = _.map(_.compact(jshint.errors), function (err) {
							return {
								method: 'jshint',
								message: (err.id ? err.id + ' ' : '') + err.reason,
								fquery: self,
								blob: blob,
								err: err,
								line: err.line,
								column: err.character
							};
						});

					self.error(errors);
				}
			});
		}
	};
};
