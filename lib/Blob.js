/*jshint node: true, strict: false */

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	moment =require('moment'),

	error = require('./Error');


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

var Blob = function (filepath, content, timestamp) {

	this.path = filepath;
	this.content = content;
	this.timestamp = timestamp;
};

_.extend(Blob.prototype, {

	toString: function () {

		return  this.path + '\n' + this.timestamp.format() + '\n' + this.content + '\n';
	},

	log: function () {

		console.log(this);
		return this;
	},

	clone: function () {

		return new Blob(this.path, this.content, this.timestamp ? moment(this.timestamp) : this.timestamp);
	},

	read: function () {

		var content, stats, timestamp;

		try {
			stats = fs.statSync(this.path);
			timestamp = stats.mtime;
			content = fs.readFileSync(this.path, charset);
		} catch (e) {
			error(2, 'can\'t read path: "' + this.path + '"');
		}

		this.content = content;
		this.timestamp = moment(timestamp);

		return this;
	},

	write: function (filepath) {

		try {
			console.log('WRITE TO', filepath);
			mkdir(path.dirname(filepath));
			fs.writeFileSync(filepath, this.content, charset);
		} catch (e) {
			error(3, 'can\'t write path: "' + filepath + '"');
		}

		return this;
	},

	copy: function (filepath) {

		try {
			console.log('COPY TO', filepath);
			mkdir(path.dirname(filepath));
			fs.createReadStream(this.path).pipe(fs.createWriteStream(filepath));
		} catch (e) {
			error(4, 'can\'t copy "' + this.path + '" to "' + filepath + '"');
		}

		return this;
	},

	remove: function () {

		if (fs.existsSync(this.path)) {
			try {
				console.log('REMOVE', this.path);
				fs.unlinkSync(this.path);
			} catch (e) {
				error(5, 'can\'t remove "' + this.path + '"');
			}
		}

		return this;
	},

	move: function (filepath) {

		try {
			console.log('MOVE TO', filepath);
			mkdir(path.dirname(filepath));
			fs.renameSync(this.path, filepath);
		} catch (e) {
			error(6, 'can\'t move "' + this.path + '" to "' + filepath + '"');
		}

		return this;
	}
});



// Constructors
// ============

var create = function (filepath, content, timestamp) {

	return new Blob(filepath, content || '', timestamp || moment());
};

var select = function (filepath) {

	var stats, timestamp;

	try {
		stats = fs.statSync(filepath);
		if (!stats.isFile()) {
			return null;
		}
		timestamp = stats.mtime;
	} catch (e) {
		return null;
		// error(1, 'can\'t select path: "' + filepath + '"');
	}

	return new Blob(filepath, undefined, moment(timestamp));
};


module.exports = {
	create: create,
	select: select
};
