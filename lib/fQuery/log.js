/*jshint node: true, strict: false */

var _ = require('underscore'),
	color = require('../color'),

	formatContent = function (content, lines, len) {

		lines = lines || 10;
		len = len || process.stdout.columns - 8;

		var bytes = content.length;
		var chunks = content.split('\n');
		var idx = 0;
		chunks = _.map(chunks, function (chunk) {

			idx += 1;
			return color('cyan', (idx < 10 ? '0' : '') + idx) + '  ' + color('blackL', chunk.slice(0, len)) + color('cyan', chunk.length > len ? ' →' : '');
		});

		content = chunks.slice(0, lines).join('\n');

		return content + '\n' + color('cyan', (chunks.length > lines ? '↓ ' : '——') + '  ' + chunks.length + ' lines    ' + bytes + ' bytes\n');
	};



module.exports = {

	logThis: function () {

		console.log(this);
		return this;
	},

	log: function (lines, len) {

		var i = 0;

		console.log(_.map(this, function (blob) {

			var s = color('yellowL', (i < 10 ? '0' : '') + i);
			s += color('white', '  ' + blob.source);
			s += color('green', '  ' + blob.timestamp.format());
			s += '\n';
			if (blob.content) {
				s += formatContent(blob.content, lines, len);
			}
			s += '\n';

			i += 1;
			return s;
		}).join(''));

		return this;
	}
};
