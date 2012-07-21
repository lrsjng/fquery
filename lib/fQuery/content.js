/*jshint node: true, strict: false */

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

			this.each(function () {

				content += (content ? sep : '') + this.content;
			});

			return content;
		},

		concat: function (sep) {

			sep = sep || '\n';

			var content = '',
				latest = moment(0);

			this.each(function () {

				content += (content ? sep : '') + this.content;
				if (this.timestamp.valueOf() > latest.valueOf()) {
					latest = this.timestamp;
				}
			});

			return this.pushStack(fQuery.virtualBlob('CONCAT', content, moment(latest)));
		},

		wrap: function (prepend, append) {

			prepend = prepend || '';
			append = append || '';

			return this.edit(function () {

				this.content = prepend + this.content + append;
			});
		},

		replace: function (rules) {

			return this.edit(function () {

				var content = this.content;

				_.each(rules, function (rule) {

					var sel = rule[0];
					var repl = rule[1];

					if (!_.isRegExp(sel)) {
						sel = new RegExp(escapeRE(sel), 'g');
					}

					content = content.replace(sel, repl);
				});

				this.content = content;
			});
		}
	};
};
