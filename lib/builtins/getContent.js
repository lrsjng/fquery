'use strict';

module.exports = function (fQuery) {

    fQuery.fn.getContent = function (sep) {

        return this.map(function (blob) {

            return fQuery._.isString(blob.content) ? blob.content : '';
        }).join(sep || '');
    };
};
