/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.concat = function (sep) {

		var moment = require('moment'),
			source = 'concat-' + fQuery.getUid(),
			latest = moment(0),
			content = this.map(function (blob) {

				if (blob.timestamp.valueOf() > latest.valueOf()) {
					latest = blob.timestamp;
				}

				return fQuery._.isString(blob.content) ? blob.content : '';
			}).join(sep || '');

		return this.push(fQuery.Blob.virtual(source, content, moment(latest)));
	};

	fQuery.fn.thenConcat = function (sep) {

		return this.then(function () {

			return this.concat(sep);
		});
	};
};
