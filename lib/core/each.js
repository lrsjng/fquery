module.exports = fQuery => {
    fQuery.fn.asyncEach = function fn1(fn) {
        const promises = this.map(function fn2(blob, idx) {
            if (fn.length < 3) {
                return fQuery.Q(fn.call(this, blob, idx)); // eslint-disable-line
            }

            const deferred = fQuery.Q.defer();
            fn.call(this, blob, idx, deferred.resolve, deferred.reject); // eslint-disable-line
            return deferred.promise;
        });

        return fQuery.Q.all(promises);
    };

    fQuery.fn.thenEach = function fn1(fn) {
        return this.then(function fn2() {
            return this.asyncEach(fn); // eslint-disable-line
        });
    };
};
