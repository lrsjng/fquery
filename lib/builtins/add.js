/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.add = function (arg) {

        var blobs = [];
        var paths = {};

        this.each(function (blob) {

            blobs.push(blob);
            paths[blob.source] = true;
        });

        fQuery(arg).each(function (blob) {

            if (!paths[blob.source]) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenAdd = function (arg) {

        return this.then(function () {

            return this.add(arg);
        });
    };
};
