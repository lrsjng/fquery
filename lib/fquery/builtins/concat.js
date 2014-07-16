/*jshint node: true */
'use strict';


var _ = require('underscore'),
	moment = require('moment');


module.exports = function (fQuery) {

	fQuery.fn.concat = function (sep) {

		return this.edit(function (done) {

			if (!this.length) {
				done();
				return;
			}

			var source = 'concat-' + fQuery.getUid(),
				latest = moment(0),
				content = _.map(this, function (blob) {

					if (blob.timestamp.valueOf() > latest.valueOf()) {
						latest = blob.timestamp;
					}

					return _.isString(blob.content) ? blob.content : '';
				}).join(sep || '');

			done(fQuery.Blob.virtual(source, content, moment(latest)));
		});
	};
};
