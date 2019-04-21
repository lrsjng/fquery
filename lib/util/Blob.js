const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const format_blob = require('./format');

const DEFAULT_CHARSET = 'utf-8';


const buffer_is_binary = (buffer, charset) => {
    charset = charset || DEFAULT_CHARSET;

    const content = buffer.toString(charset, 0, 24);
    const l = content.length;

    for (let i = 0; i < l; i += 1) {
        const code = content.charCodeAt(i);
        if (code === 65533 || code <= 8) {
            return true;
        }
    }

    return false;
};


module.exports = class Blob {
    static fromContent(source, content, timestamp) {
        return new Blob(source, content, undefined, timestamp, false);
    }

    static fromBuffer(source, buffer, timestamp) {
        return new Blob(source, undefined, buffer, timestamp, false);
    }

    static fromPath(filepath, onlyStats) {
        return new Blob(filepath).read(onlyStats);
    }

    constructor(source, content, buffer, timestamp, stats) {
        this.source = source;
        this.content = content;
        this.buffer = buffer;
        this.timestamp = new Date(timestamp);
        this.stats = stats;
    }

    clone() {
        return new Blob(this.source, this.content, this.buffer, this.timestamp ? new Date(this.timestamp) : this.timestamp, this.stats);
    }

    isFile() {
        return this.stats && this.stats.isFile();
    }

    isDirectory() {
        return this.stats && this.stats.isDirectory();
    }

    isVirtual() {
        return this.stats === false;
    }

    read(onlyStats, charset) {
        charset = charset || DEFAULT_CHARSET;

        try {
            this.stats = fs.statSync(this.source);
            this.timestamp = new Date(this.stats.mtime);
            if (!onlyStats && this.stats.isFile()) {
                this.buffer = fs.readFileSync(this.source);
                if (!buffer_is_binary(this.buffer, charset)) {
                    this.content = this.buffer.toString(charset);
                    this.buffer = undefined;
                }
            }
        } catch (e) {
            e.blob = this;
            throw e;
        }

        return this;
    }

    write(filepath, charset) {
        charset = charset || DEFAULT_CHARSET;

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
    }

    move(filepath) {
        try {
            mkdirp.sync(path.dirname(filepath));
            fs.renameSync(this.source, filepath);
        } catch (e) {
            e.blob = this;
            throw e;
        }

        return this;
    }

    toString(lines, len, idx, file, line, column) {
        return format_blob(this, lines, len, idx, file, line, column);
    }

    // used by node console to format return values
    inspect() {
        return this.toString();
    }

    log(lines, len, idx, file, line, column) {
        process.stdout.write(this.toString(lines, len, idx, file, line, column));
        return this;
    }
};
