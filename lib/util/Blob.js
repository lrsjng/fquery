const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const path = require('path');

const formatBlob = require('./format');

const defaultCharset = 'utf-8';


function bufferIsBinary(buffer, charset) {
    charset = charset || defaultCharset;

    const content = buffer.toString(charset, 0, 24);
    const l = content.length;

    for (let i = 0; i < l; i += 1) {
        const charCode = content.charCodeAt(i);
        if (charCode === 65533 || charCode <= 8) {
            return true;
        }
    }

    return false;
}


function Blob(source, content, buffer, timestamp, stats) {
    this.source = source;
    this.content = content;
    this.buffer = buffer;
    this.timestamp = moment(timestamp);
    this.stats = stats;
}
module.exports = Blob;


Blob.fromContent = (source, content, timestamp) => {
    return new Blob(source, content, undefined, timestamp, false);
};


Blob.fromBuffer = (source, buffer, timestamp) => {
    return new Blob(source, undefined, buffer, timestamp, false);
};


Blob.fromPath = (filepath, onlyStats) => {
    return new Blob(filepath).read(onlyStats);
};


Blob.prototype.clone = function fn() {
    return new Blob(this.source, this.content, this.buffer, this.timestamp ? moment(this.timestamp) : this.timestamp, this.stats);
};


Blob.prototype.isFile = function fn() {
    return this.stats && this.stats.isFile();
};


Blob.prototype.isDirectory = function fn() {
    return this.stats && this.stats.isDirectory();
};


Blob.prototype.isVirtual = function fn() {
    return this.stats === false;
};


Blob.prototype.read = function fn(onlyStats, charset) {
    charset = charset || defaultCharset;

    try {
        this.stats = fs.statSync(this.source);
        this.timestamp = moment(this.stats.mtime);
        if (!onlyStats && this.stats.isFile()) {
            this.buffer = fs.readFileSync(this.source);
            if (!bufferIsBinary(this.buffer, charset)) {
                this.content = this.buffer.toString(charset);
                this.buffer = undefined;
            }
        }
    } catch (e) {
        e.blob = this;
        throw e;
    }

    return this;
};


Blob.prototype.write = function fn(filepath, charset) {
    charset = charset || defaultCharset;

    try {
        if (this.content === undefined && this.buffer === undefined) {
            throw new Error('neither content nor buffer to write');
        }

        mkdirp.sync(path.dirname(filepath));
        if (this.content !== undefined) {
            fs.writeFileSync(filepath, this.content, charset);
        } else if (this.buffer !== undefined) {
            fs.writeFileSync(filepath, this.buffer);
        }
    } catch (e) {
        e.blob = this;
        throw e;
    }

    return this;
};


Blob.prototype.move = function fn(filepath) {
    try {
        mkdirp.sync(path.dirname(filepath));
        fs.renameSync(this.source, filepath);
    } catch (e) {
        e.blob = this;
        throw e;
    }

    return this;
};


Blob.prototype.toString = function fn(lines, len, idx, file, line, column) {
    return formatBlob(this, lines, len, idx, file, line, column);
};


// used by node console to format return values
Blob.prototype.inspect = function fn() {
    return this.toString();
};


Blob.prototype.log = function fn(lines, len, idx, file, line, column) {
    process.stdout.write(this.toString(lines, len, idx, file, line, column));
    return this;
};
