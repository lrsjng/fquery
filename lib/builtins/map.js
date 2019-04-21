const {is_str, is_regexp} = require('../util/misc');


module.exports = fQuery => {
    const escapeStringRegexp = require('escape-string-regexp');

    const createFn = function fn1(fn, re, to) { // eslint-disable-line
        return extendFn(blob => { // eslint-disable-line
            return fn(blob).replace(re, to);
        });
    };

    const replace = function fn1(re, to) { // eslint-disable-line
        if (!is_regexp(re)) {
            re = new RegExp(escapeStringRegexp(re), 'g');
        }

        return createFn(this, re, to); // eslint-disable-line
    };

    const prefix = function fn1(prefix, to) { // eslint-disable-line
        return createFn(this, new RegExp('^' + escapeStringRegexp(prefix)), to); // eslint-disable-line
    };

    const suffix = function fn1(suffix, to) { // eslint-disable-line
        return createFn(this, new RegExp(escapeStringRegexp(suffix) + '$'), to); // eslint-disable-line
    };

    const extendFn = fn => {
        Object.assign(fn, {
            replace,
            r: replace,
            prefix,
            p: prefix,
            suffix,
            s: suffix
        });

        return fn;
    };

    const map = blob => {
        return blob && is_str(blob.source) && blob.source || is_str(blob) && blob || '';
    };

    fQuery.map = extendFn(map);
};
