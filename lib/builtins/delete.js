'use strict';

module.exports = function (fQuery) {

    fQuery.fn.delete = function () {

        var rimraf = require('rimraf');

        this.each(function (blob) {

            try {
                rimraf.sync(blob.source);
                fQuery.report({
                    type: 'okay',
                    method: 'delete',
                    message: blob.source,
                    fquery: this,
                    blob: blob
                });
            } catch (err) {
                fQuery.report({
                    type: 'err',
                    method: 'delete',
                    message: err.message,
                    fquery: this,
                    blob: blob,
                    data: err
                });
            }
        });
        return this;
    };

    fQuery.fn.thenDelete = function () {

        return this.then(function () {

            return this.delete();
        });
    };
};
