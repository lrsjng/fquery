module.exports = fQuery => {
    fQuery.fn.do = function fn1(fn) {
        if (fQuery._.isFunction(fn)) {
            fn.call(this); // eslint-disable-line
        }

        return this;
    };

    fQuery.fn.asyncDo = function fn1(fn) {
        if (fQuery._.isFunction(fn)) {
            if (!fn.length) {
                return fQuery.Q(fn.call(this)); // eslint-disable-line
            }

            const deferred = fQuery.Q.defer();
            fn.call(this, deferred.resolve, deferred.reject); // eslint-disable-line
            return deferred.promise;
        }

        return fQuery.Q();
    };

    fQuery.fn.thenDo = function fn1(fn) {
        return this.then(function fn2() {
            return this.asyncDo(fn); // eslint-disable-line
        });
    };
};
