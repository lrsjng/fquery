/*jshint node: true */
'use strict';


var fs = require('fs'),
	path = require('path'),
	moment = require('moment'),
	mkdirp = require('mkdirp'),

	Event = require('./Event'),
	fmt = require('./format/blob');


// Helpers
// =======
var charset = 'utf-8',

	bufferIsBinary = function (buffer) {

		var content = buffer.toString(charset, 0, 24),
			i, l, charCode;

		for (i = 0, l = content.length; i < l; i += 1) {
			charCode = content.charCodeAt(i);
			if (charCode === 65533 || charCode <= 8) {
				return true;
			}
		}

		return false;
	};


// Blob
// ====
var Blob = module.exports = function (source, content, buffer, timestamp, stats) {

	this.source = source;
	this.content = content;
	this.buffer = buffer;
	this.timestamp = moment(timestamp);
	this.stats = stats;
};
Blob.fn = Blob.prototype;


Blob.virtual = function (source, content, timestamp) {

	return new Blob(source, content, undefined, timestamp, false);
};


Blob.select = function (filepath, onlyStats) {

	var blob = new Blob(filepath);

	try {
		blob.read(onlyStats);
	} catch (err) {}

	return blob;
};


Blob.fn.clone = function () {

	return new Blob(this.source, this.content, this.buffer, this.timestamp ? moment(this.timestamp) : this.timestamp, this.stats);
};


Blob.fn.exists = function () {

	return !!this.stats;
};


Blob.fn.isFile = function () {

	return this.stats && this.stats.isFile();
};


Blob.fn.isDirectory = function () {

	return this.stats && this.stats.isDirectory();
};


Blob.fn.isVirtual = function () {

	return this.stats === false;
};


Blob.fn.read = function (onlyStats) {

	try {
		this.stats = fs.statSync(this.source);
		this.timestamp = moment(this.stats.mtime);
		if (!onlyStats) {
			this.buffer = fs.readFileSync(this.source);
			if (!bufferIsBinary(this.buffer)) {
				this.content = this.buffer.toString(charset);
				this.buffer = undefined;
			}
		}
	} catch (e) {
		Event.error({
			method: 'read',
			message: e.toString(),
			blob: this,
			data: e
		});
	}

	return this;
};


Blob.fn.write = function (filepath) {

	if (this.content === undefined && this.buffer === undefined) {
		Event.error({
			method: 'write',
			message: 'neither content nor buffer',
			blob: this
		});
	}
	try {
		mkdirp.sync(path.dirname(filepath));
		if (this.content !== undefined) {
			fs.writeFileSync(filepath, this.content, charset);
		} else if (this.buffer !== undefined) {
			fs.writeFileSync(filepath, this.buffer);
		}
		Event.ok({
			method: 'write',
			message: filepath,
			blob: this
		});
	} catch (e) {
		Event.error({
			method: 'write',
			message: e.toString(),
			blob: this,
			data: e
		});
	}

	return this;
};


Blob.fn.move = function (filepath) {

	try {
		mkdirp.sync(path.dirname(filepath));
		fs.renameSync(this.source, filepath);
		Event.ok({
			method: 'move',
			message: filepath,
			blob: this
		});
	} catch (e) {
		Event.error({
			method: 'move',
			message: e.toString(),
			blob: this,
			data: e
		});
	}

	return this;
};


Blob.fn.toString = function (lines, len, idx) {

	return fmt.formatBlob(this, lines, len, idx);
};


// used by node console to format return values
Blob.fn.inspect = function () {

	return this.toString();
};


Blob.fn.log = function (lines, len, idx) {

	process.stdout.write(this.toString(lines, len, idx));
	return this;
};
