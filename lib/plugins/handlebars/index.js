/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.handlebars = function (data) {

		var handlebars = require('handlebars');

		return this.edit(function (blob) {

			try {
				blob.content = handlebars.compile(blob.content)(data);
			} catch (err) {
				fQuery.Event.error({
					method: 'handlebars',
					message: err.toString(),
					fquery: this,
					blob: blob,
					data: err
				});
			}
		});
	};

	fQuery.fn.thenHandlebars = function (data) {

		return this.then(function () {

			return this.handlebars(data);
		});
	};
};
