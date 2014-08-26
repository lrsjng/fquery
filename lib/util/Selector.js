/*jshint node: true */
'use strict';


var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

var globOptions = {
        dot: true,
        silent: false,
        sync: true
    };

var defaults = {
        files: true,
        dirs: false,
        uniq: true,
        onlyStats: false,
        group: ';',
        prefix: ':',
        suffix: ',',
        negation: '!'
    };


function splitPrefix(sequence, settings) {

    var prefix = '';
    var suffixes = sequence;

    var parts = sequence.split(settings.prefix);

    // win fix
    if (/^\w:\\/.test(sequence)) {
        parts = [parts[0] + ':' +parts[1]].concat(parts.slice(2));
    }

    if (parts.length > 2) {
        var err = new Error('only one prefix allowed');
        err.sequence = sequence;
        err.settings = settings;
        throw err;
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
}


function pathsForGlob(pattern, settings) {

    return glob(pattern, globOptions).map(function (filepath) {

        return path.resolve(filepath);
    });
}


function pathsForGroup(sequence, settings) {

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
}


function Selector(options) {

    this.settings = _.extend({}, defaults, options);
}
module.exports = Selector;


Selector.prototype.paths = function (sequence, options) {

    var settings = _.extend({}, this.settings, options);

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

    paths = paths.filter(function (filepath) {

        try {
            var stats = fs.statSync(filepath);
            return settings.files && stats.isFile() || settings.dirs && stats.isDirectory();
        } catch (e) {}

        return false;
    });

    return paths;
};


Selector.prototype.blobs = function (arg, options) {

    var Blob = require('./Blob');
    var settings = _.extend({}, this.settings, options);

    if (arg instanceof Blob) {
        return settings.files && arg.isFile() || settings.dirs && arg.isDirectory() || arg.isVirtual() ? [arg] : [];
    }

    if (_.isString(arg)) {
        return _.compact(this.paths(arg, {files: true, dirs: true}).map(function (filepath) {

            var blob = Blob.fromPath(filepath, settings.onlyStats);
            return settings.files && blob.isFile() || settings.dirs && blob.isDirectory() ? blob : null;
        }));
    }

    if (arg && arg.length) {

        var self = this;
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
