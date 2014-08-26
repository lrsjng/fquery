/*jshint node: true */
'use strict';


var chalk = require('chalk');
var fmtBlob = require('../selector/format');
var fs = require('fs');
var moment = require('moment');
var util = require('util');


function format(ev) {

    var s = '';

    if (ev.type.lines > -2) {
        s += '\n';
    }

    s += chalk.grey('[' + moment().format('HH:mm:ss') + '] ');
    s += chalk[ev.type.color].bold(ev.type.icon + '  '+ ev.method + ': ' + ev.message + '   ');

    if (ev.type.lines > -1) {
        s += '\n';
    }
    if (ev.type.lines > -2) {
        s += '\n';
    }

    if (ev.type.lines > -3) {
        if (ev.blob) {

            var type = 'UNKNOWN';
            if (ev.blob.isVirtual()) {
                type = 'VIRTUAL';
            } else if (ev.blob.isFile()) {
                type = 'FILE';
            } else if (ev.blob.isDirectory()) {
                type = 'DIRECTORY';
            }

            if (ev.line) {
                s += fmtBlob.formatHeader(null, type, ev.blob.source, ev.blob.timestamp);
                s += '\n';

                var content = ev.blob.content;

                if (ev.file && ev.file !== ev.blob.source) {
                    try {
                        content = fs.readFileSync(ev.file, 'utf-8');
                    } catch (e) {
                        content = '';
                    }
                    s += fmtBlob.formatHeader(null, type, ev.file, null);
                    s += '\n';
                }

                var marks = {};
                marks[ev.line] = ev.column || true;
                s += fmtBlob.formatLines(content, null, ev.line - 3, ev.line + 3, marks);
            } else {
                s += ev.blob.toString(ev.type.lines);
            }
        } else if (ev.fquery) {
            s += ev.fquery.toString(ev.type.lines);
        }
        // if (ev.data) {
        if (ev.data && !ev.line) {
            s += chalk[ev.type.color](util.inspect(ev.data)) + '\n';
        }
    } else {
        s += '\n';
    }

    return s;
}


module.exports = {
    format: format
};
