/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.asyncEach = function (fn) {

        var promises = this.map(function (blob, idx) {

                if (fn.length < 3) {
                    return fQuery.Q(fn.call(this, blob, idx));
                }

                var deferred = fQuery.Q.defer();
                fn.call(this, blob, idx, deferred.resolve, deferred.reject);
                return deferred.promise;
            });

        return fQuery.Q.all(promises);
    };

    fQuery.fn.thenEach = function (fn) {

        return this.then(function () {

            return this.asyncEach(fn);
        });
    };
};
