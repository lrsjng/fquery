const fs = require('fs');
const glob = require('glob');
const path = require('path');
const {is_str} = require('./misc');

const union = (x, y) => Array.from(new Set([...x, ...y]));
const difference = (x, y) => x.filter(xi => !y.includes(xi));

const GLOB_OPTS = {
    dot: true,
    silent: false,
    sync: true
};

const DEFAULTS = {
    files: true,
    dirs: false,
    uniq: true,
    onlyStats: false,
    group: ';',
    prefix: ':',
    suffix: ',',
    negation: '!'
};


const split_prefix = (sequence, settings) => {
    let prefix = '';
    let suffixes = sequence;

    let parts = sequence.split(settings.prefix);

    // win fix
    if ((/^\w:\\/).test(sequence)) {
        parts = [parts[0] + ':' + parts[1]].concat(parts.slice(2));
    }

    if (parts.length > 2) {
        const err = new Error('only one prefix allowed');
        err.sequence = sequence;
        err.settings = settings;
        throw err;
    } else if (parts.length === 2) {
        prefix = parts[0];
        suffixes = parts[1];
    }

    suffixes = suffixes.split(settings.suffix).map(suffix => suffix.trim());

    return {
        prefix: prefix.trim(),
        suffixes
    };
};


const paths_for_glob = pattern => {
    return glob(pattern, GLOB_OPTS).map(filepath => path.resolve(filepath));
};


const paths_for_group = (sequence, settings) => {
    sequence = sequence.trim();
    if (!sequence) {
        return [];
    }

    const split = split_prefix(sequence, settings);

    let paths = [];

    split.suffixes.forEach(suffix => {
        if (suffix[0] === settings.negation) {
            paths = difference(paths, paths_for_glob(path.join(split.prefix, suffix.slice(1).trim()), settings));
        } else {
            paths = union(paths, paths_for_glob(path.join(split.prefix, suffix), settings));
        }
    });

    return paths;
};


module.exports = class Selector {
    constructor(options) {
        this.settings = {...DEFAULTS, ...options};
    }

    paths(sequence, options) {
        const settings = {...this.settings, ...options};

        if (!is_str(sequence)) {
            return [];
        }

        sequence = sequence.trim();
        if (!sequence) {
            return [];
        }

        let paths = [];

        sequence.split(settings.group).forEach(part => {
            paths = union(paths, paths_for_group(part, settings));
        });

        paths = paths.filter(filepath => {
            try {
                const stats = fs.statSync(filepath);
                return settings.files && stats.isFile() || settings.dirs && stats.isDirectory();
            } catch (e) {/* skip */}

            return false;
        });

        return paths;
    }

    blobs(arg, options) {
        const Blob = require('./Blob');
        const settings = {...this.settings, ...options};

        if (arg instanceof Blob) {
            return settings.files && arg.isFile() || settings.dirs && arg.isDirectory() || arg.isVirtual() ? [arg] : [];
        }

        if (is_str(arg)) {
            return this.paths(arg, {files: true, dirs: true}).map(filepath => {
                const blob = Blob.fromPath(filepath, settings.onlyStats);
                return settings.files && blob.isFile() || settings.dirs && blob.isDirectory() ? blob : null;
            }).filter(x => x);
        }

        if (arg && arg.length) {
            const self = this;
            let blobs = Array.from(arg, a => self.blobs(a, settings)).flat();


            if (settings.uniq) {
                const sources = {};

                blobs = blobs.filter(blob => {
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
};
