/*jshint node: true */
'use strict';


var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	glob = require('glob'),

	Event = require('./Event'),
	Blob = require('./Blob'),

	splitPrefix = function (sequence, settings) {

		var prefix = '';
		var suffixes = sequence;

		var parts = sequence.split(settings.prefix);

		// win fix
		if (/^\w:\\/.test(sequence)) {
			parts = [parts[0] + ':' +parts[1]].concat(parts.slice(2));
		}

		if (parts.length > 2) {
			Event.error({
				method: 'selector',
				message: 'only one prefix allowed',
				data: sequence
			});
		} else if (parts.length === 2) {
			prefix = parts[0];
			suffixes = parts[1];
		}

		suffixes = suffixes.split(settings.suffix).map(function (suffix) {

			return suffix.trim();
		});

		return {
			prefix: prefix.trim(),
			suffixes: suffixes
		};
	},

	globOptions = {
		dot: true,
		silent: false,
		sync: true
	},
	pathsForGlob = function (pattern, settings) {

		return glob(pattern, globOptions).map(function (filepath) {

			return path.resolve(filepath);
		});
	},

	pathsForGroup = function (sequence, settings) {

		sequence = sequence.trim();
		if (!sequence) {
			return [];
		}

		var split = splitPrefix(sequence, settings);

		var paths = [];

		split.suffixes.forEach(function (suffix) {

			if (suffix[0] === settings.negation) {
				paths = _.difference(paths, pathsForGlob(path.join(split.prefix, suffix.slice(1).trim()), settings));
			} else {
				paths = _.union(paths, pathsForGlob(path.join(split.prefix, suffix), settings));
			}
		});

		return paths;
	},

	defaults = {
		files: true,
		dirs: false,
		uniq: true,
		onlyStats: false,
		group: ';',
		prefix: ':',
		suffix: ',',
		negation: '!'
	};




var Selector = module.exports = function (options) {

	this.settings = _.extend({}, defaults, options);
};


Selector.prototype.paths = function (sequence, options) {

	var self = this,
		settings = _.extend({}, self.settings, options);

	if (!_.isString(sequence)) {
		return [];
	}

	sequence = sequence.trim();
	if (!sequence) {
		return [];
	}

	var paths = [];

	sequence.split(settings.group).forEach(function (part) {

		paths = _.union(paths, pathsForGroup(part, settings));
	});

	if (!settings.files || !settings.dirs) {
		paths = paths.filter(function (filepath) {
			try {
				var stats = fs.statSync(filepath);
				return settings.files && stats.isFile() || settings.dirs && stats.isDirectory();
			} catch (e) {}
			return false;
		});
	}

	return paths;
};


Selector.prototype.blobs = function (arg, options) {

	var self = this,
		settings = _.extend({}, self.settings, options);

	if (arg instanceof Blob) {
		return settings.files && arg.isFile() || settings.dirs && arg.isDirectory() || arg.isVirtual() ? [arg] : [];
	}

	if (_.isString(arg)) {
		return _.compact(self.paths(arg, {files: true, dirs: true}).map(function (filepath) {

			var blob = Blob.fromPath(filepath, settings.onlyStats);
			return settings.files && blob.isFile() || settings.dirs && blob.isDirectory() ? blob : null;
		}));
	}

	if (arg && arg.length) {

		var blobs = _.flatten(_.map(arg, function (a) {

			return self.blobs(a, settings);
		}));


		if (settings.uniq) {
			var sources = {};

			blobs = blobs.filter(function (blob) {

				if (sources[blob.source]) {
					return false;
				}

				sources[blob.source] = true;
				return true;
			});
		}

		return blobs;
	}

	return [];
};
