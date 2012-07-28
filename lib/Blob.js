/*jshint node: true */
'use strict';

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	moment = require('moment'),
	mkdirp = require('mkdirp'),
	rimraf = require('rimraf'),

	Event = require('./Event'),
	fmt = require('./format/blob');



// Helpers
// =======
var charset = 'utf-8',

	bufferIsBinary = function (buffer) {

		var content = buffer.toString(charset, 0, 24);

		for (var i = 0, l = content.length; i < l; i += 1) {
			var charCode = content.charCodeAt(i);
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

_.extend(Blob, {

	virtual: function (source, content, timestamp) {

		return new Blob(source, content, undefined, timestamp, false);
	},

	select: function (filepath, onlyStats) {

		var blob = new Blob(filepath);

		try {
			blob.read(onlyStats);
		} catch (err) {}

		return blob;
	},

	mkdirp: function (dirpath) {

		try {
			mkdirp.sync(dirpath);
			return new Blob.select(dirpath);
		} catch (err) {
			Blob.error({
				method: 'mkdirp',
				message: err.toString(),
				data: err
			});
		}
	},

	rmfr: function (dirpath) {

		try {
			rimraf.sync(dirpath);
			return true;
		} catch (err) {
			Blob.error({
				method: 'rmfr',
				message: err.toString(),
				data: err
			});
		}
		return false;
	}
});

_.extend(Blob, Event);



_.extend(Blob.prototype, {

	clone: function () {

		return new Blob(this.source, this.content, this.buffer, this.timestamp ? moment(this.timestamp) : this.timestamp, this.stats);
	},

	exists: function () {

		return !!this.stats;
	},

	isFile: function () {

		return this.stats && this.stats.isFile();
	},

	isDirectory: function () {

		return this.stats && this.stats.isDirectory();
	},

	isVirtual: function () {

		return this.stats === false;
	},

	read: function (onlyStats) {

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
			Blob.error({
				method: 'read',
				message: e.toString(),
				blob: this,
				data: e
			});
		}

		return this;
	},

	write: function (filepath) {

		if (this.content === undefined && this.buffer === undefined) {
			Blob.error({
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
			Blob.ok({
				method: 'write',
				message: filepath,
				blob: this
			});
		} catch (e) {
			Blob.error({
				method: 'write',
				message: e.toString(),
				blob: this,
				data: e
			});
		}

		return this;
	},

	copy: function (filepath) {

		// try {
		// 	mkdirp.sync(path.dirname(filepath));
		// 	fs.createReadStream(this.source).pipe(fs.createWriteStream(filepath));
		// 	Blob.ok({
		// 		method: 'copy',
		// 		message: filepath,
		// 		blob: this
		// 	});
		// } catch (e) {
		// 	Blob.error({
		// 		method: 'copy',
		// 		message: e.toString(),
		// 		blob: this,
		// 		data: e
		// 	});
		// }

		// return this;

		return this.write(filepath);
	},

	remove: function () {

		try {
			rimraf.sync(this.source);
			Blob.ok({
				method: 'remove',
				message: this.source,
				blob: this
			});
		} catch (e) {
			Blob.error({
				method: 'remove',
				message: e.toString(),
				blob: this,
				data: e
			});
		}

		return this;
	},

	move: function (filepath) {

		try {
			mkdirp.sync(path.dirname(filepath));
			fs.renameSync(this.source, filepath);
			Blob.ok({
				method: 'move',
				message: filepath,
				blob: this
			});
		} catch (e) {
			Blob.error({
				method: 'move',
				message: e.toString(),
				blob: this,
				data: e
			});
		}

		return this;
	},

	toString: function (lines, len, idx) {

		return fmt.formatBlob(this, lines, len, idx);
	},

	log: function (lines, len, idx) {

		process.stdout.write(this.toString(lines, len, idx));
		return this;
	},

	inspect: function () {

		return this.toString();
	}
});
