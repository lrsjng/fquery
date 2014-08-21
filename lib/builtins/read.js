/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.read = function () {

        return this.each(function (blob) {

            blob.read();
        });
    };

    fQuery.fn.thenRead = function () {

        return this.then(function () {

            return this.read();
        });
    };
};
