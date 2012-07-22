/*jshint node: true, strict: false */

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	moment =require('moment'),

	error = require('./Error').error,
	color = require('./color');



// Helpers
// =======
var	mkdir = function (dir, mode) {

		mode = mode || '755';

		try {
			var stats = fs.statSync(dir);
			if (stats.isDirectory()) {
				return true;
			}
		} catch (err1) {}

		try {
			fs.mkdirSync(dir, mode);
			return true;
		} catch (err2) {}

		var parent = path.dirname(dir);
		if (dir !== parent && mkdir(parent, mode)) {
			fs.mkdirSync(dir, mode);
			return true;
		}

		return false;
	},

	charset = 'utf-8',

	bufferIsBinary = function (buffer) {

		var content = buffer.toString(charset, 0, 24);

		for (var i = 0, l = content.length; i < l; i += 1) {
			var charCode = content.charCodeAt(i);
			if (charCode === 65533 || charCode <= 8) {
				return true;
			}
		}

		return false;
	},

	formatContent = function (content, lines, len, bytes) {

		bytes = bytes || content.length;

		var chunks = content.split('\n'),
			idx = 0;

		chunks = _.map(chunks, function (chunk) {

			idx += 1;
			return color('cyan', (idx < 10 ? '0' : '') + idx) + '  ' + color('blackL', chunk.slice(0, len)) + color('cyan', chunk.length > len ? ' →' : '');
		});

		content = lines ? chunks.slice(0, lines).join('\n') + '\n' : '';

		return content + color('cyan', (chunks.length > lines ? '↓ ' : '——') + '  ' + chunks.length + ' lines  ' + bytes + ' bytes\n');
	},

	formatBuffer = function (buffer, lines, len) {

		var content = '';

		for (var i = 0, l = Math.min(buffer.length, 1024); i < l; i += 1) {

			var val = buffer[i];
			content += (val < 16 ? '0' : '') + val.toString(16);

			if ((i+1) % 2 === 0) {
				content += ' ';
			}

			if ((i+1) % 32 === 0) {
				content += '\n';
			}
		}

		return formatContent(content, lines, len, buffer.length);
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

Blob.virtual = function (source, content, timestamp) {

	return new Blob(source, content, undefined, timestamp, undefined);
};

Blob.select = function (filepath, onlyStats) {

	var blob = new Blob(filepath);

	try {
		blob.read(onlyStats);
	} catch (err) {}

	return blob;
};

Blob.error = function (method, message, blob, err) {

	error(method, message, undefined, blob, err);
};



_.extend(Blob.prototype, {

	error: function (method, message, err) {

		Blob.error(method, message, this, err);
		return this;
	},

	clone: function () {

		return new Blob(this.source, this.content, this.buffer, this.timestamp ? moment(this.timestamp) : this.timestamp, this.stats);
	},

	isFile: function () {

		return this.stats && this.stats.isFile();
	},

	isDirectory: function () {

		return this.stats && this.stats.isDirectory();
	},

	read: function (onlyStats) {

		var content, buffer, stats, timestamp;

		try {
			stats = fs.statSync(this.source);
			timestamp = stats.mtime;
			if (!onlyStats) {
				buffer = fs.readFileSync(this.source);
				if (!bufferIsBinary(buffer)) {
					content = buffer.toString(charset);
					buffer = undefined;
				}
			}
		} catch (e) {
			return this.error('read', e.toString(), e);
		}

		this.content = content;
		this.buffer = buffer;
		this.timestamp = moment(timestamp);
		this.stats = stats;

		return this;
	},

	write: function (filepath) {

		try {
			console.log('WRITE TO', filepath);
			mkdir(path.dirname(filepath));
			if (this.content !== undefined) {
				fs.writeFileSync(filepath, this.content, charset);
			} else if (this.buffer !== undefined) {
				fs.writeFileSync(filepath, this.buffer);
			}
		} catch (e) {
			return this.error('write', e.toString(), e);
		}

		return this;
	},

	copy: function (filepath) {

		// try {
		// 	console.log('COPY TO', filepath);
		// 	mkdir(path.dirname(filepath));
		// 	fs.createReadStream(this.source).pipe(fs.createWriteStream(filepath));
		// } catch (e) {
		// 	return this.error('copy', 'failed', e, filepath);
		// }

		return this.write(filepath);
	},

	remove: function () {

		if (fs.existsSync(this.source)) {
			try {
				console.log('REMOVE', this.source);
				fs.unlinkSync(this.source);
			} catch (e) {
				return this.error('remove', e.toString(), e);
			}
		}

		return this;
	},

	move: function (filepath) {

		try {
			console.log('MOVE TO', filepath);
			mkdir(path.dirname(filepath));
			fs.renameSync(this.source, filepath);
		} catch (e) {
			return this.error('move', e.toString(), e);
		}

		return this;
	},

	toString: function (lines, len, idx) {

		lines = _.isNumber(lines) ? lines : 10;
		len = _.isNumber(len) ? len : process.stdout.columns - 8;

		var s = '';
		if (_.isNumber(idx)) {
			s += color('yellowL', (idx < 10 ? '0' : '') + idx);
		} else {
			s += color('cyan', '——');
		}
		s += '  ' + color('white', this.source);
		s += '  ' + color('green', this.timestamp.format());
		s += lines ? '\n' : '  ';
		if (this.content !== undefined) {
			s += formatContent(this.content, lines, len);
		}
		if (this.buffer !== undefined) {
			s += formatBuffer(this.buffer, lines, len);
		}
		s += lines ? '\n' : '';
		return s;
	},

	log: function (lines, len, idx) {

		console.log(this.toString(lines, len, idx));
		return this;
	}
});
