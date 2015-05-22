'use strict';

module.exports = function (fQuery) {

    fQuery.fn.wrap = function (prepend, append) {

        prepend = prepend || '';
        append = append || '';

        return this.edit(function (blob) {

            blob.content = prepend + blob.content + append;
        });
    };

    fQuery.fn.thenWrap = function (prepend, append) {

        return this.then(function () {

            return this.wrap(prepend, append);
        });
    };
};
