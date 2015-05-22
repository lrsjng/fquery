'use strict';

module.exports = function (fQuery) {

    fQuery.fn.not = function (arg) {

        var blobs = [];
        var paths = {};

        fQuery(arg).each(function (blob) {

            paths[blob.source] = true;
        });

        this.each(function (blob) {

            if (!paths[blob.source]) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenNot = function (arg) {

        return this.then(function () {

            return this.not(arg);
        });
    };
};
