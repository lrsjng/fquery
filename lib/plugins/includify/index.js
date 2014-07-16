/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	var _ = require('underscore'),

		defaults = {
			charset: 'utf-8'
		};


	return {

		includify: function (options) {

			var fquery = this,
				settings = _.extend({}, defaults, options),
				includify = require('./includify');

			return this.edit(function (blob) {

				try {
					blob.content = includify({ file: blob.source, content: blob.content, charset: settings.charset });
				} catch (err) {
					fQuery.Event.error({
						method: 'includify',
						message: err.message,
						fquery: fquery,
						blob: blob,
						file: err.file,
						line: err.line,
						column: err.column,
						data: err
					});
				}
			});
		}
	};
};
