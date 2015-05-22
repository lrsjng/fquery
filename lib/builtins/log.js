'use strict';

module.exports = function (fQuery) {

    fQuery.fn.log = function (lines, len) {

        process.stdout.write(this.toString(lines, len));
        return this;
    };

    fQuery.fn.thenLog = function (lines, len) {

        return this.then(function () {

            return this.log(lines, len);
        });
    };
};
