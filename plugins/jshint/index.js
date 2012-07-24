/*jshint node: true, strict: false */

var _ = require('underscore'),
	jshint = require('jshint').JSHINT;


module.exports = function (fQuery) {

	return {

		jshint: function (options) {

			var fquery = this;

			return this.each(function (blob) {

				if (!jshint(blob.content, options)) {
					fQuery.error(_.map(_.compact(jshint.errors), function (err) {

						return {
							method: 'jshint',
							message: (err.id ? err.id + ' ' : '') + err.reason,
							fquery: fquery,
							blob: blob,
							line: err.line,
							column: err.character,
							data: err
						};
					}));
				}
			});
		}
	};
};
