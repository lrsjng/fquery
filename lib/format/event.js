/*jshint node: true */
'use strict';

var util = require('util'),
	_ = require('underscore'),
	moment = require('moment'),
	color = require('./color'),
	fmtBlob = require('./blob'),


	format = function (event) {

		var s = '';

		if (event.type.lines > -2) {
			s += '\n';
		}

		s += color('blackL', '[' + moment().format('HH:mm:ss') + '] ');
		s += color(event.type.color + 'L', event.type.icon + '  '+ event.method + ': ' + event.message + '   ');

		if (event.type.lines > -1) {
			s += '\n';
		}
		if (event.type.lines > -2) {
			s += '\n';
		}

		if (event.type.lines > -3) {
			if (event.blob) {
				if (event.line) {
					s += fmtBlob.formatHeader(null, event.blob.source, event.blob.timestamp);
					s += '\n';
					var marks = {};
					marks[event.line] = event.column || true;
					s += fmtBlob.formatLines(event.blob.content, null, event.line - 3, event.line + 3, marks);
				} else {
					s += event.blob.toString(event.type.lines);
				}
			} else if (event.fquery) {
				s += event.fquery.toString(event.type.lines);
			}
			if (event.data && !event.line) {
				s += color(event.type.color, util.inspect(event.data)) + '\n';
			}
		} else {
			s += '\n';
		}

		return s;
	};


module.exports = {
	format: format
};
