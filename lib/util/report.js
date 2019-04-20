const _ = require('lodash');
const chalk = require('chalk');
const util = require('util');


const styles = {
    err: {color: 'red', icon: '[err]', lines: 10},
    fail: {color: 'red', icon: '[fail]', lines: -3},
    info: {color: 'cyan', icon: '[info]', lines: -3},
    okay: {color: 'green', icon: '[okay]', lines: -3},
    warn: {color: 'yellow', icon: '[warn]', lines: -3}
};

const defaults = {
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


function reportToString(report) {
    const style = styles[report.type] || styles.info;

    let s = '';

    if (style.lines > -2) {
        s += '\n';
    }

    s += chalk[style.color].bold(
        style.icon + ' ' +
        (report.method ? report.method + ' - ' : '') +
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
        if (report.data && !report.line) {
            s += chalk[style.color](util.inspect(report.data)) + '\n';
        }
    } else {
        s += '\n';
    }

    if (report.err) {
        s += chalk.red(report.err.stack + '\n');
    }

    return s;
}


function printReport(report) {
    process.stdout.write(reportToString(report));
}


function onReport(report) {
    report = _.extend({}, defaults, report);
    report.type = String(report.type).toLowerCase();

    printReport(report);

    if (report.type === 'err' || report.err) {
        process.exit(1); // eslint-disable-line no-process-exit
    }
}


module.exports = onReport;
