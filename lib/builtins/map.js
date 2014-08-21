/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    var escapeStringRegexp = require('escape-string-regexp'),

        createFn = function (fn, re, to) {

            return extendFn(function (blob) {

                return fn(blob).replace(re, to);
            });
        },

        replace = function (re, to) {

            if (!fQuery._.isRegExp(re)) {
                re = new RegExp(escapeStringRegexp(re), 'g');
            }

            return createFn(this, re, to);
        },

        prefix = function (prefix, to) {

            return createFn(this, new RegExp('^' + escapeStringRegexp(prefix)), to);
        },

        suffix = function (suffix, to) {

            return createFn(this, new RegExp(escapeStringRegexp(suffix) + '$'), to);
        },

        extendFn = function (fn) {

            fQuery._.extend(fn, {
                replace: replace,
                r: replace,
                prefix: prefix,
                p: prefix,
                suffix: suffix,
                s: suffix
            });

            return fn;
        },

        map = function (blob) {

            return blob && fQuery._.isString(blob.source) && blob.source || fQuery._.isString(blob) && blob || '';
        };

    fQuery.map = extendFn(map);
};
