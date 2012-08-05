/*jshint node: true */
'use strict';

var fs = require('fs'),
	_ = require('underscore'),

	live_content = fs.readFileSync(__dirname + '/live-fquery.js', 'utf-8'),

	template = '<script>' + live_content + '</script>';


module.exports = function (fQuery) {

	return {

		live: function (view) {

			fQuery.info({
				method: 'live',
				message: 'not available yet',
				fquery: this
			});

			return this;

			// var fquery = this;

			// return this.edit(function (blob) {

			// 	try {
			// 		var content = blob.content;

			// 		content = content.replace('</head>', template.replace('LIVE_HINT', '"countUp"') + '</head>');

			// 		blob.content = content;
			// 	} catch (err) {
			// 		fQuery.error({
			// 			method: 'live',
			// 			message: err.toString(),
			// 			fquery: fquery,
			// 			blob: blob,
			// 			data: err
			// 		});
			// 	}
			// });
		}
	};
};
