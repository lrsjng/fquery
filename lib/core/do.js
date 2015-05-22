'use strict';

module.exports = function (fQuery) {

    fQuery.fn.do = function (fn) {

        if (fQuery._.isFunction(fn)) {
            fn.call(this);
        }

        return this;
    };

    fQuery.fn.asyncDo = function (fn) {

        if (fQuery._.isFunction(fn)) {
            if (!fn.length) {
                return fQuery.Q(fn.call(this));
            }

            var deferred = fQuery.Q.defer();
            fn.call(this, deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        return fQuery.Q();
    };

    fQuery.fn.thenDo = function (fn) {

        return this.then(function () {

            return this.asyncDo(fn);
        });
    };
};
