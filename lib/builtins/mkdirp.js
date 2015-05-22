'use strict';

module.exports = function (fQuery) {

    fQuery.mkdirp = function (dirpath) {

        var mkdirp = require('mkdirp');

        try {
            mkdirp.sync(dirpath);
            fQuery.report({
                type: 'okay',
                method: 'mkdirp',
                message: dirpath
            });
        } catch (e) {
            fQuery.report({
                type: 'err',
                method: 'mkdirp',
                message: e.message,
                err: e
            });
        }
        return fQuery(dirpath, {dirs: true});
    };
};
