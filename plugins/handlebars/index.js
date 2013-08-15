/*jshint node: true */
'use strict';


module.exports = function (fQuery) {


	return {

		handlebars: function (data) {

			var fquery = this,
				handlebars = require('handlebars');

			return this.edit(function (blob) {

				try {
					blob.content = handlebars.compile(blob.content)(data);
				} catch (err) {
					fQuery.error({
						method: 'handlebars',
						message: err.toString(),
						fquery: fquery,
						blob: blob,
						data: err
					});
				}
			});
		}
	};
};
