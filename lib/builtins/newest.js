'use strict';

module.exports = function (fQuery) {

    fQuery.fn.newest = function () {

        var blobs = [];

        this.each(function (blob) {

            if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
                blobs = [blob];
            } else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
                blobs.push(blob);
            }
        });

        return this.push(blobs);
    };

    fQuery.fn.thenNewest = function () {

        return this.then(function () {

            return this.newest();
        });
    };
};
