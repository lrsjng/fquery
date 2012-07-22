/*jshint node: true, strict: false */

var _ = require('underscore'),

	less = require('./less-sync');


module.exports = function (fQuery) {

	return {

		less: function (options) {

			return this.edit(function () {

				try {
					this.content = less(this.source, this.content, false);
				} catch (err) {
					fQuery.error('less', err, this);
				}
			});
		}
	};
};
