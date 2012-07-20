/*jshint node: true, strict: false */

var path = require('path'),
	_ = require('underscore'),
	glob = require('glob'),

	error = require('./Error').error;



// Helpers
// =======
var reNeg = /^!/,
	reWithspaceBegin = /^\s+/,
	reWithspaceEnd = /\s+$/,

	globOptions = {
		silent: false
	};



var trim = function (sequence) {

	return sequence.replace(reWithspaceBegin, '').replace(reWithspaceEnd, '');
};



var splitPrefix = function (sequence) {

	var prefix = '';
	var suffixes = sequence;

	var parts = sequence.split(':');
	if (parts.length > 2) {
		error(2, 'only one prefix allowed: ' + sequence);
	} else if (parts.length === 2) {
		prefix = parts[0];
		suffixes = parts[1];
	}

	suffixes = _.map(suffixes.split(','), function (suffix) {

		return trim(suffix);
	});

	return {
		prefix: trim(prefix),
		suffixes: suffixes
	};
};



var findGroup = function (sequence) {

	sequence = trim(sequence);
	if (!sequence) {
		return [];
	}

	var split = splitPrefix(sequence);

	var paths = [];

	_.each(split.suffixes, function (suffix) {

		if (reNeg.test(suffix)) {
			paths = _.difference(paths, glob.sync(path.join(split.prefix, suffix.slice(1)), globOptions));
		} else {
			paths = _.union(paths, glob.sync(path.join(split.prefix, suffix), globOptions));
		}
	});

	return paths;
};



var find = function (sequence) {

	if (!_.isString(sequence)) {
		return [];
	}

	sequence = trim(sequence);
	if (!sequence) {
		return [];
	}

	var paths = [];

	_.each(sequence.split(';'), function (part) {

		paths = _.union(paths, findGroup(part));
	});

	return paths;
};



module.exports = find;
