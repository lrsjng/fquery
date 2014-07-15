/*jshint node: true */
'use strict';


var fs = require('fs'),
	util = require('util'),
	_ = require('underscore'),
	chalk = require('chalk'),
	moment = require('moment'),
	fmtBlob = require('./blob'),


	format = function (event) {

		var s = '';

		if (event.type.lines > -2) {
			s += '\n';
		}

		s += chalk.grey('[' + moment().format('HH:mm:ss') + '] ');
		s += chalk[event.type.color].bold(event.type.icon + '  '+ event.method + ': ' + event.message + '   ');

		if (event.type.lines > -1) {
			s += '\n';
		}
		if (event.type.lines > -2) {
			s += '\n';
		}

		if (event.type.lines > -3) {
			if (event.blob) {
				var type = event.blob.isVirtual() ? 'VIRTUAL' : (!event.blob.exists() ? 'N/A' : (event.blob.isFile() ? 'FILE' : 'DIRECTORY'));

				if (event.line) {
					s += fmtBlob.formatHeader(null, type, event.blob.source, event.blob.timestamp);
					s += '\n';

					var content = event.blob.content;

					if (event.file && event.file !== event.blob.source) {
						try {
							content = fs.readFileSync(event.file, 'utf-8');
						} catch (e) {
							content = '';
						}
						s += fmtBlob.formatHeader(null, type, event.file, null);
						s += '\n';
					}

					var marks = {};
					marks[event.line] = event.column || true;
					s += fmtBlob.formatLines(content, null, event.line - 3, event.line + 3, marks);
				} else {
					s += event.blob.toString(event.type.lines);
				}
			} else if (event.fquery) {
				s += event.fquery.toString(event.type.lines);
			}
			// if (event.data) {
			if (event.data && !event.line) {
				s += chalk[event.type.color](util.inspect(event.data)) + '\n';
			}
		} else {
			s += '\n';
		}

		return s;
	};


module.exports = {
	format: format
};
