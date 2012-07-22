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

	formatContent = function (content, lines, len) {

		var bytes = content.length,
			chunks = content.split('\n'),
			idx = 0;

		chunks = _.map(chunks, function (chunk) {

			idx += 1;
			return color('cyan', (idx < 10 ? '0' : '') + idx) + '  ' + color('blackL', chunk.slice(0, len)) + color('cyan', chunk.length > len ? ' →' : '');
		});

		content = chunks.slice(0, lines).join('\n');

		return content + '\n' + color('cyan', (chunks.length > lines ? '↓ ' : '——') + '  ' + chunks.length + ' lines  ' + bytes + ' bytes\n');
	};



// Blob
// ====
var charset = 'utf-8';

var Blob = module.exports = function (source, content, timestamp, stats) {

	this.source = source;
	this.content = content;
	this.timestamp = moment(timestamp);
	this.stats = stats;
};


// Constructors
// ------------
Blob.virtual = function (source, content, timestamp) {

	return new Blob(source, content, timestamp, undefined);
};

Blob.select = function (filepath) {

	var stats, timestamp;

	try {
		stats = fs.statSync(filepath);
		timestamp = stats.mtime;
	} catch (e) {}

	return new Blob(filepath, undefined, timestamp, stats);
};


_.extend(Blob.prototype, {

	clone: function () {

		return new Blob(this.source, this.content, this.timestamp ? moment(this.timestamp) : this.timestamp, this.stats);
	},

	isFile: function () {

		return this.stats && this.stats.isFile();
	},

	isDirectory: function () {

		return this.stats && this.stats.isDirectory();
	},

	read: function () {

		var content, stats, timestamp;

		try {
			stats = fs.statSync(this.source);
			timestamp = stats.mtime;
			content = fs.readFileSync(this.source, charset);
		} catch (e) {
			error('read', this);
		}

		this.content = content;
		this.timestamp = moment(timestamp);
		this.stats = stats;

		return this;
	},

	write: function (filepath) {

		try {
			console.log('WRITE TO', filepath);
			mkdir(path.dirname(filepath));
			fs.writeFileSync(filepath, this.content, charset);
		} catch (e) {
			error('write', filepath, this);
		}

		return this;
	},

	copy: function (filepath) {

		try {
			console.log('COPY TO', filepath);
			mkdir(path.dirname(filepath));
			fs.createReadStream(this.source).pipe(fs.createWriteStream(filepath));
		} catch (e) {
			error('copy', filepath, this);
		}

		return this;
	},

	remove: function () {

		if (fs.existsSync(this.source)) {
			try {
				console.log('REMOVE', this.source);
				fs.unlinkSync(this.source);
			} catch (e) {
				error('remove', this);
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
			error('move', filepath, this);
		}

		return this;
	},

	toString: function (lines, len, idx) {

		lines = lines || 10;
		len = len || process.stdout.columns - 8;
		idx = idx || 0;

		var s = color('yellowL', (idx < 10 ? '0' : '') + idx);
		s += '  ' + color('white', this.source);
		s += '  ' + color('green', this.timestamp.format());
		s += '\n';
		if (this.content) {
			s += formatContent(this.content, lines, len);
		}
		return s + '\n';
	},

	log: function (lines, len, idx) {

		console.log(this.toString(lines, len, idx));
		return this;
	}
});
