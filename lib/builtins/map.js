'use strict';

module.exports = function (fQuery) {

    var escapeStringRegexp = require('escape-string-regexp');

    var createFn = function (fn, re, to) {

        return extendFn(function (blob) {

            return fn(blob).replace(re, to);
        });
    };

    var replace = function (re, to) {

        if (!fQuery._.isRegExp(re)) {
            re = new RegExp(escapeStringRegexp(re), 'g');
        }

        return createFn(this, re, to);
    };

    var prefix = function (prefix, to) {

        return createFn(this, new RegExp('^' + escapeStringRegexp(prefix)), to);
    };

    var suffix = function (suffix, to) {

        return createFn(this, new RegExp(escapeStringRegexp(suffix) + '$'), to);
    };

    var extendFn = function (fn) {

        fQuery._.extend(fn, {
            replace: replace,
            r: replace,
            prefix: prefix,
            p: prefix,
            suffix: suffix,
            s: suffix
        });

        return fn;
    };

    var map = function (blob) {

        return blob && fQuery._.isString(blob.source) && blob.source || fQuery._.isString(blob) && blob || '';
    };

    fQuery.map = extendFn(map);
};
