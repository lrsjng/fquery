const _ = require('lodash');
const chalk = require('chalk');

const is_num = x => _.isNumber(x);


function align(value, width, right, fill) {
    fill = fill === undefined ? ' ' : String(fill);
    let s = String(value);
    while (s.length < width) {
        s = right ? fill + s : s + fill;
    }
    s = right ? s.slice(-width) : s.slice(0, width);
    return s;
}


function formatLine(content, len, idx, error) {
    len = is_num(len) ? len : process.stdout.columns - 8;

    let s = '';

    if (is_num(idx)) {
        s += error ? chalk.red.bold(align(idx, 3, true, 0)) : chalk.cyan(align(idx, 3, true, 0));
        s += '  ';
    }
    if (!is_num(error)) {
        s += chalk.grey(content.slice(0, len));
    } else {
        error -= 1;
        s += chalk.grey(content.slice(0, error));
        s += chalk.white.bgRed(content.slice(error, error + 1));
        s += chalk.grey(content.slice(error + 1, len));
    }
    if (content.length > len) {
        s += ' ';
        s += chalk.cyan('→');
    }
    s += '\n';

    return s;
}


function formatLines(content, len, from, to, errors) {
    const lines = content.split('\n');
    from = from || 1;
    to = to || lines.length;
    errors = errors || {};

    let s = '';
    for (let i = Math.max(0, from - 1), l = lines.length; i < to && i < l; i += 1) {
        s += formatLine(lines[i], len, i + 1, errors[i + 1]);
    }

    return s;
}


function formatByteLine(buffer, idx) {
    let s = '';
    for (let i = 0, l = buffer.length; i < l; i += 1) {
        const val = buffer[i];
        s += (val < 16 ? '0' : '') + val.toString(16);

        if ((i + 1) % 2 === 0) {
            s += ' ';
        }
    }
    s = chalk.grey(s);

    if (is_num(idx)) {
        s = chalk.cyan(align(idx.toString(16), 3, true, 0)) + '  ' + s;
    }

    s += '\n';

    return s;
}


function formatByteLines(buffer, bpl, from, to) {
    from = from || 0;
    to = to || buffer.length;

    let s = '';
    for (let i = from, l = buffer.length; i < to && i < l; i += bpl) {
        s += formatByteLine(buffer.slice(i, i + Math.min(bpl, l - i)), i);
    }

    return s;
}


function formatContent(content, lines, len) {
    const charCount = content.length;
    const lineCount = content.split('\n').length;
    const s = lines ? formatLines(content, len, 1, lines) : '';

    return s + chalk.cyan((lineCount > lines ? '···' : '———') + '  ' + lineCount + ' lines  ' + charCount + ' chars\n');
}


function formatBuffer(buffer, lines, len) {
    len = is_num(len) ? len : process.stdout.columns - 8;

    const byteCount = buffer.length;
    const bpl = parseInt(len / 5, 10) * 2;
    const s = lines ? formatByteLines(buffer, bpl, 0, lines * bpl) : '';

    return s + chalk.cyan((byteCount > lines * bpl ? '···' : '———') + '  ' + byteCount + ' bytes\n');
}


function formatHeader(idx, type, source, timestamp) {
    let s = '';
    if (is_num(idx)) {
        s += chalk.yellow.bold('[' + idx + ']');
    } else {
        s += chalk.cyan('———');
    }
    if (type) {
        s += '  ' + chalk.cyan(type);
    }
    s += '  ' + chalk.white.bold(source);
    s += timestamp ? '  ' + chalk.yellow.bold(timestamp.format()) : '';
    return s;
}


function formatBlob(blob, lines, len, idx, file, line, column) {
    lines = is_num(lines) ? lines : 10;

    let type = 'UNKNOWN';
    if (blob.isVirtual()) {
        type = 'VIRTUAL';
    } else if (blob.isFile()) {
        type = 'FILE';
    } else if (blob.isDirectory()) {
        type = 'DIRECTORY';
    }

    let s = formatHeader(idx, type, blob.source, blob.timestamp);
    if (line) {
        s += '\n';
        if (file && file !== blob.source) {
            s += chalk.red.bold('>>>  ' + file + ':' + line + ':' + column + '\n');
        } else {
            const marks = {};
            marks[line] = column || true;
            s += formatLines(blob.content, null, line - 3, line + 3, marks);
        }
    } else {
        s += lines > 0 ? '\n' : '  ';
        if (blob.content !== undefined) {
            s += formatContent(blob.content, lines, len);
        }
        if (blob.buffer !== undefined) {
            s += formatBuffer(blob.buffer, lines, len);
        }
        if ((blob.isFile() || blob.isVirtual()) && blob.content === undefined && blob.buffer === undefined) {
            s += chalk.red.bold('———  [neither content nor buffer]\n');
        }
        if (blob.isDirectory()) {
            s += '\n';
        }
        s += lines > 0 ? '\n' : '';
    }
    return s;
}


module.exports = formatBlob;
