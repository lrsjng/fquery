/*jshint node: true */
'use strict';


var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var moment = require('moment');
var util = require('util');


var STYLES = {
        err: {color: 'red', icon: '[err] ', lines: 10},
        fail: {color: 'red', icon: '[fail]', lines: -3},
        info: {color: 'cyan', icon: '[info]', lines: -3},
        okay: {color: 'green', icon: '[okay]', lines: -3},
        warn: {color: 'yellow', icon: '[warn]', lines: -3}
    };

var DEFAULT_REPORT = {
        type: 'info',
        method: null,
        message: null,
        fquery: null,
        blob: null,
        file: null,
        line: null,
        column: null,
        error: null,
        data: null
    };


function Reporter() {

}
module.exports = Reporter;


Reporter.prototype.onReport = function (reports) {

    var self = this;
    var errReports = [];

    if (!Array.isArray(reports)) {
        reports = [reports];
    }

    reports = reports.map(function (report) {

        report = _.extend({}, DEFAULT_REPORT, report);
        report.type = ('' + report.type).toLowerCase();
        if (report.type === 'err') {
            errReports.push(report);
        }
        return report;
    });

    reports.forEach(function (report) {

        self.printReport(report);
    });

    if (errReports.length) {
        var err = errReports[0].err || new Error();
        err.reports = reports;
        throw err;
    }
};


Reporter.prototype.printReport = function (report) {

    process.stdout.write(this.reportToString(report));
};


Reporter.prototype.reportToString = function (report) {

    var style = STYLES[report.type] || STYLES.info;
    var type, content, marks;

    var s = '';

    if (style.lines > -2) {
        s += '\n';
    }

    s += chalk.grey('[' + moment().format('HH:mm:ss') + '] ');
    s += chalk[style.color].bold(
        style.icon + '  ' +
        (report.method ? report.method + ': ' : '') +
        (report.message ? report.message : '') +
        '   '
    );

    if (style.lines > -1) {
        s += '\n';
    }
    if (style.lines > -2) {
        s += '\n';
    }

    if (style.lines > -3) {
        if (report.blob) {
            s += report.blob.toString(style.lines, null, null, report.file, report.line, report.column);
        } else if (report.fquery) {
            s += report.fquery.toString(style.lines);
        }
        // if (report.data) {
        if (report.data && !report.line) {
            s += chalk[style.color](util.inspect(report.data)) + '\n';
        }
    } else {
        s += '\n';
    }

    return s;
};
