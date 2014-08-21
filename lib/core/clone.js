/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.clone = function () {

        return fQuery(this.map(function (blob) { return blob.clone(); }));
    };

    fQuery.fn.thenClone = function () {

        return this.then(function () {

            return this.clone();
        });
    };
};
