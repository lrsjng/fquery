/*jshint node: true, strict: false */

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	glob = require('glob'),

	error = require('./Error').error,
	Blob = require('./Blob');



// Helpers
// =======
var reWithspaceBegin = /^\s+/,
	reWithspaceEnd = /\s+$/,
	trim = function (sequence) {

		return sequence.replace(reWithspaceBegin, '').replace(reWithspaceEnd, '');
	},

	splitPrefix = function (sequence, settings) {

		var prefix = '';
		var suffixes = sequence;

		var parts = sequence.split(settings.prefix);
		if (parts.length > 2) {
			return error('splitPrefix', 'only one prefix allowed', undefined, undefined, sequence);
		} else if (parts.length === 2) {
			prefix = parts[0];
			suffixes = parts[1];
		}

		suffixes = _.map(suffixes.split(settings.suffix), function (suffix) {

			return trim(suffix);
		});

		return {
			prefix: trim(prefix),
			suffixes: suffixes
		};
	},

	globOptions = {
		silent: false,
		sync: true
	},
	pathsForGlob = function (pattern, settings) {

		return _.map(glob(pattern, globOptions), function (filepath) {

			return path.resolve(filepath);
		});
	},

	pathsForGroup = function (sequence, settings) {

		sequence = trim(sequence);
		if (!sequence) {
			return [];
		}

		var split = splitPrefix(sequence, settings);

		var paths = [];

		_.each(split.suffixes, function (suffix) {

			if (suffix[0] === settings.negation) {
				paths = _.difference(paths, pathsForGlob(path.join(split.prefix, trim(suffix.slice(1))), settings));
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



// Selector
// ========
var Selector = module.exports = function (options) {

	this.settings = _.extend({}, defaults, options);
};

_.extend(Selector.prototype, {

	paths: function (sequence, options) {

		var self = this,
			settings = _.extend({}, self.settings, options);

		if (!_.isString(sequence)) {
			return [];
		}

		sequence = trim(sequence);
		if (!sequence) {
			return [];
		}

		var paths = [];

		_.each(sequence.split(settings.group), function (part) {

			paths = _.union(paths, pathsForGroup(part, settings));
		});

		if (!settings.files || !settings.dirs) {
			paths = _.filter(paths, function (filepath) {
				try {
					var stats = fs.statSync(filepath);
					return settings.files && stats.isFile() || settings.dirs && stats.isDirectory();
				} catch (e) {}
				return false;
			});
		}

		return paths;
	},

	blobs: function (arg, options) {

		var self = this,
			settings = _.extend({}, self.settings, options);

		if (arg instanceof Blob) {
			return settings.files && arg.isFile() || settings.dirs && arg.isDirectory() ? [arg] : [];
		}

		if (_.isString(arg)) {
			return _.compact(_.map(self.paths(arg, {files: true, dirs: true}), function (filepath) {

				var blob = Blob.select(filepath, options.onlyStats);
				return settings.files && blob.isFile() || settings.dirs && blob.isDirectory() ? blob : null;
			}));
		}

		if (arg && arg.length) {

			var blobs = _.flatten(_.map(arg, function (a) {

				return self.blobs(a, settings);
			}));

			if (settings.uniq) {
				var sources = {};

				blobs = _.filter(blobs, function (blob) {

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
	}
});
