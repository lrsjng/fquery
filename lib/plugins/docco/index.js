/*jshint node: true */
'use strict';



module.exports = function (fQuery) {


	var _ = require('underscore'),

		// defaults = {
		// 	layout: 'parallel',
		// 	output: 'docs',
		// 	template: null,
		// 	css: null,
		// 	extension: null
		// }

		defaults = {
			callback: null
		};


	return {

		docco: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options),
				docco = require('docco');

			fQuery.info({
				method: 'docco',
				message: 'generating docs',
				fquery: this
			});

			settings.sources = _.pluck(this, 'source');
			// docco.document(settings, settings.callback);
			fQuery.error({
				method: 'docco',
				message: 'still broken until next npm release of docco',
				fquery: this
			});

			return this;
		}
	};
};
