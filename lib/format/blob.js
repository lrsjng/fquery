/*jshint node: true */
'use strict';

var _ = require('underscore'),
	color = require('./color'),


	align = function (value, width, right, fill) {

		if (fill === undefined) {
			fill = ' ';
		}
		var s = '' + value;
		while (s.length < width) {
			s = right ? '' + fill + s : s + fill;
		}
		s = right ? s.slice(-width) : s.slice(0, width);
		return s;
	},

	formatLine = function (content, len, idx, error) {

		len = _.isNumber(len) ? len : process.stdout.columns - 8;

		var s = '';

		if (_.isNumber(idx)) {
			s += color(error ? 'red' : 'cyan', align(idx, 3, true, 0));
			s += '  ';
		}
		if (!_.isNumber(error)) {
			s += color('blackL', content.slice(0, len));
		} else {
			error = error - 1;
			s += color('blackL', content.slice(0, error));
			s += color('redI', content.slice(error, error + 1));
			s += color('blackL', content.slice(error + 1, len));
		}
		if (content.length > len) {
			s += ' ';
			s += color('cyan', '→');
		}
		s += '\n';

		return s;
	},

	formatLines = function (content, len, from, to, errors) {

		var lines = content.split('\n');
		from = from || 1;
		to = to || lines.length;
		errors = errors || {};

		var s = '';
		for (var i = Math.max(0, from - 1), l = lines.length; i < to && i < l; i += 1) {
			s += formatLine(lines[i], len, i + 1, errors[i+1]);
		}

		return s;
	},

	formatByteLine = function (buffer, idx) {

		var s = '';
		for (var i = 0, l = buffer.length; i < l; i += 1) {

			var val = buffer[i];
			s += (val < 16 ? '0' : '') + val.toString(16);

			if ((i+1) % 2 === 0) {
				s += ' ';
			}
		}
		s = color('blackL', s);

		if (_.isNumber(idx)) {
			s = color('cyan', align(idx.toString(16), 3, true, 0)) + '  ' + s;
		}

		s += '\n';

		return s;
	},

	formatByteLines = function (buffer, bpl, from, to) {

		from = from || 0;
		to = to || buffer.length;

		var s = '';
		for (var i = from, l = buffer.length; i < to && i < l; i += bpl) {
			s += formatByteLine(buffer.slice(i, i + Math.min(bpl, l - i)), i);
		}

		return s;
	},

	formatContent = function (content, lines, len) {

		var byteCount = content.length;
		var lineCount = content.split('\n').length;
		var s = lines ? formatLines(content, len, 1, lines) : '';

		return s + color('cyan', (lineCount > lines ? '···' : '———') + '  ' + lineCount + ' lines  ' + byteCount + ' bytes\n');
	},

	formatBuffer = function (buffer, lines, len) {

		len = _.isNumber(len) ? len : process.stdout.columns - 8;

		var byteCount = buffer.length;
		var bpl = parseInt(len / 5, 10) * 2;
		var s = lines ? formatByteLines(buffer, bpl, 0, lines * bpl) : '';

		return s + color('cyan', (byteCount > lines * bpl ? '···' : '———') + '  ' + byteCount + ' bytes\n');
	},

	formatHeader = function (idx, type, source, timestamp) {

		var s = '';
		if (_.isNumber(idx)) {
			s += color('yellowL', '[' + idx + ']');
		} else {
			s += color('cyan', '———');
		}
		if (type) {
			s += '  ' + color('cyan', type);
		}
		s += '  ' + color('white', source);
		s += timestamp ? '  ' + color('yellowL', timestamp.format()) : '';
		return s;
	},

	formatBlob = function (blob, lines, len, idx) {

		lines = _.isNumber(lines) ? lines : 10;

		var type = blob.isVirtual() ? 'VIRTUAL' : (!blob.exists() ? 'N/A' : (blob.isFile() ? 'FILE' : 'DIRECTORY'));

		var s = formatHeader(idx, type, blob.source, blob.timestamp);
		s += (lines > 0) ? '\n' : '  ';
		if (blob.content !== undefined) {
			s += formatContent(blob.content, lines, len);
		}
		if (blob.buffer !== undefined) {
			s += formatBuffer(blob.buffer, lines, len);
		}
		if ((blob.isFile() || blob.isVirtual()) && blob.content === undefined && blob.buffer === undefined) {
			s += color('redL', '———  ☹  neither content nor buffer\n');
		}
		if (blob.isDirectory()) {
			s += '\n';
		}
		s += (lines > 0)  ? '\n' : '';
		return s;
	},

	formatFQuery = function (fquery, lines, len) {

		var s = color('cyan', 'fQuery with ' + fquery.length + ' blobs    stack: [' + _.pluck(fquery._stack, 'length') + ']    ' + (fquery._promise && fquery._promise.isPending() ? '*' : '') + '\n');

		for (var i = 0, l = fquery.length; i < l; i += 1) {
			s += fquery[i].toString(lines, len, i);
		}

		return s;
	};


module.exports = {
	align: align,
	formatLines: formatLines,
	formatContent: formatContent,
	formatByteLines: formatByteLines,
	formatBuffer: formatBuffer,
	formatHeader: formatHeader,
	formatBlob: formatBlob,
	formatFQuery: formatFQuery
};
