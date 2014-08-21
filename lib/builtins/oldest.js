/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.oldest = function () {

        var blobs = [];

        this.each(function (blob) {

            if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
                blobs = [blob];
            } else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenOldest = function () {

        return this.then(function () {

            return this.oldest();
        });
    };
};
