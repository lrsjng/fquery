/*jshint node: true */
'use strict';


var _ = require('underscore'),
	moment = require('moment');


module.exports = function (fQuery) {

	fQuery.fn.concat = function (sep) {

		sep = sep || '\n';

		return this.then(function () {

			if (!this.length) {
				this.push_instant();
				return;
			}

			var source = 'concat-' + fQuery.uid(),
				content = '',
				latest = moment(0);

			this.each_instant(function (blob) {

				if (!_.isString(blob.content)) {
					fQuery.error({
						method: 'concat',
						message: 'no content',
						fquery: this,
						blob: blob
					});
				}

				content += (content ? sep : '') + blob.content;
				if (blob.timestamp.valueOf() > latest.valueOf()) {
					latest = blob.timestamp;
				}
			});

			this.push_instant(fQuery.Blob.virtual(source, content, moment(latest)));
		});
	};
};
