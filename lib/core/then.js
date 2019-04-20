module.exports = fQuery => {
    fQuery.fn.isPending = function fn() {
        this._promise = this._promise || fQuery.Q();
        return this._promise.isPending();
    };

    fQuery.fn.getPromise = function fn() {
        this._promise = this._promise || fQuery.Q();
        return this._promise;
    };

    fQuery.fn.then = function fn1(fn) {
        const self = this;

        this._promise = this._promise || fQuery.Q();
        this._promise = this._promise.then(() => {
            if (!fn.length) {
                const result = fn.call(self); // eslint-disable-line
                // don't misinterpret fquery results as promise because it is a thenable
                return fQuery.Q(result instanceof fQuery ? null : result);
            }

            const deferred = fQuery.Q.defer();
            fn.call(self, deferred.resolve, deferred.reject); // eslint-disable-line
            return deferred.promise;
        });

        return this;
    };
};
