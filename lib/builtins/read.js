'use strict';

module.exports = function (fQuery) {

    fQuery.fn.read = function () {

        return this.each(function (blob) {

            try {
                blob.read();
            } catch (e) {
                fQuery.report({
                    type: 'err',
                    method: 'read',
                    message: e.message,
                    fquery: this,
                    blob: blob,
                    err: e
                });
            }
        });
    };

    fQuery.fn.thenRead = function () {

        return this.then(function () {

            return this.read();
        });
    };
};
