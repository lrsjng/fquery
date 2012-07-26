/*jshint node: true */
'use strict';

var _ = require('underscore'),
	moment = require('moment'),

	escapeRE = function (sequence) {

		return sequence.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	};



module.exports = function (fQuery) {

	return {

		content: function (sep) {

			sep = sep || '\n';

			var content = '';

			this.each(function (blob) {

				content += (content ? sep : '') + blob.content;
			});

			return content;
		},

		concat: function (sep) {

			if (!this.length) {
				return this.pushStack();
			}

			sep = sep || '\n';

			var fquery = this,
				source = 'concat-' + fQuery.uid(),
				content = '',
				latest = moment(0);

			this.each(function (blob) {

				if (!_.isString(blob.content)) {
					fQuery.error({
						method: 'concat',
						message: 'no content',
						fquery: fquery,
						blob: blob
					});
				}

				content += (content ? sep : '') + blob.content;
				if (blob.timestamp.valueOf() > latest.valueOf()) {
					latest = blob.timestamp;
				}
			});

			return this.pushStack(fQuery.virtualBlob(source, content, moment(latest)));
		},

		wrap: function (prepend, append) {

			prepend = prepend || '';
			append = append || '';

			return this.edit(function (blob) {

				blob.content = prepend + blob.content + append;
			});
		},

		replace: function (rules) {

			rules = rules || [];

			return this.edit(function (blob) {

				var content = blob.content;

				_.each(rules, function (rule) {

					var sel = rule[0];
					var repl = rule[1];

					if (_.isString(sel)) {
						sel = new RegExp(escapeRE(sel), 'g');
					}

					if (_.isRegExp(sel)) {
						content = content.replace(sel, repl);
					}
				});

				blob.content = content;
			});
		}
	};
};
