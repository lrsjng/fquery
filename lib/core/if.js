/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.if = function (condition, thenFn, elseFn) {

        if (fQuery._.isFunction(condition)) {
            condition = condition.call(this);
        }

        return this.do(condition ? thenFn : elseFn);
    };

    fQuery.fn.asyncIf = function (condition, thenFn, elseFn) {

        if (fQuery._.isFunction(condition)) {
            condition = condition.call(this);
        }

        return this.asyncDo(condition ? thenFn : elseFn);
    };

    fQuery.fn.thenIf = function (condition, thenFn, elseFn) {

        return this.then(function () {

            return this.asyncIf(condition, thenFn, elseFn);
        });
    };
};
