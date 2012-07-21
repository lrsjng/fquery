/*jshint node: true, strict: false */

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	moment =require('moment'),

	error = require('./Error').error;



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

	log: function () {

		console.log(this);
		return this;
	},

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
			error(2, 'can\'t read source: "' + this.source + '"');
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
			error(3, 'can\'t write to: "' + filepath + '"');
		}

		return this;
	},

	copy: function (filepath) {

		try {
			console.log('COPY TO', filepath);
			mkdir(path.dirname(filepath));
			fs.createReadStream(this.source).pipe(fs.createWriteStream(filepath));
		} catch (e) {
			error(4, 'can\'t copy "' + this.source + '" to "' + filepath + '"');
		}

		return this;
	},

	remove: function () {

		if (fs.existsSync(this.source)) {
			try {
				console.log('REMOVE', this.source);
				fs.unlinkSync(this.source);
			} catch (e) {
				error(5, 'can\'t remove "' + this.source + '"');
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
			error(6, 'can\'t move "' + this.source + '" to "' + filepath + '"');
		}

		return this;
	}
});
