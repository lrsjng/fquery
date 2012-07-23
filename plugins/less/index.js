/*jshint node: true, strict: false */

var _ = require('underscore'),
	less = require('./less-sync');


module.exports = function (fQuery) {

	return {

		less: function (options) {

			var self = this;

			return this.edit(function () {

				try {
					this.content = less(this.source, this.content, false);
				} catch (err) {
					self.error('less', err.name + ', ' + err.message, this, err, err.line, err.column + 1);
				}
			});
		}
	};
};
