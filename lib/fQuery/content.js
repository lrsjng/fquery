/*jshint node: true */
'use strict';

var _ = require('underscore'),
	moment = require('moment'),

	escapeRegExp = function (str) {

		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	};


module.exports = function (fQuery) {

	return {

		content: function (sep) {

			sep = sep || '\n';

			var content = '';

			this.each_instant(function (blob) {

				content += (content ? sep : '') + blob.content;
			});

			return content;
		},

		concat: function (sep) {

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

				this.push_instant(fQuery.virtualBlob(source, content, moment(latest)));
			});
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

					var sel = rule[0],
						repl = rule[1];

					if (_.isString(sel)) {
						sel = new RegExp(escapeRegExp(sel), 'g');
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
